const { Course, Unit, Chapter, Question, Option } = require('../models');
const axios = require('axios');
const { YoutubeTranscript } = require("youtube-transcript");

class CourseController {
    static async createCourse(req, res, next) {
        try {
            const openai = req.openai;
            const { courseName, courseUnits } = req.body;

            // image search term
            const imageSearchTerm = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        "role": "user",
                        "content": `Please provide a good image search term for the title of a course about ${courseName}. This search term will be fed into the unsplash API to generate image for course thumbnails. Make sure it is appropriate for course thumbnails.`
                    },
                ]
            })

            // unsplash
            const { data: unsplashImage } = await axios(`https://api.unsplash.com/search/photos?page=1&query=${imageSearchTerm?.choices[0]?.message.content}&client_id=${process.env.UNSPLASH_API_KEY}`);

            // post the main course in db
            const addedCourse = await Course.create({ courseName, courseImage: unsplashImage?.results[0]?.urls.small_s3 });

            // generate the book chapters
            for (const unit of courseUnits) {
                const promptPrefix = `Given the unit: ${unit} of the main subject ${courseName}: `;
                let visited = "";
                const bookChaptersList = [];

                for (let i = 0; i < 3; ++i) {
                    const response = await openai.chat.completions.create({
                        model: "gpt-3.5-turbo",
                        messages: [
                            {
                                "role": "user",
                                "content": promptPrefix +
                                    `Provide me with a book chapter title for the unit in less than 10 words that doesn't exist yet in ${visited}.`
                            },
                        ]
                    })

                    const bookChapterName = response?.choices[0]?.message?.content.replace(/^"(.*)"$/, '$1');
                    bookChaptersList.push({ chapterName: bookChapterName });
                    visited += `${bookChapterName}, `
                }

                // post the chapters and units to DB
                const addedUnit = await Unit.create({ unitName: unit, CourseId: addedCourse.dataValues.id })
                await Chapter.bulkCreate(bookChaptersList.map((chapter) => {
                    chapter.UnitId = addedUnit.dataValues.id;
                    return chapter;
                }))
            }

            res.status(200).json({ message: "Course generated successfully", course: addedCourse });
        } catch (err) {
            next(err);
        }
    }

    static async getCourse(req, res, next) {
        try {
            const course = await Course.findOne({
                where: {
                    id: req.params.id
                },
                include: {
                    model: Unit,
                    include: {
                        model: Chapter,
                        include: {
                            model: Question,
                            include: {
                                model: Option
                            }
                        }
                    }
                }
            });

            // Sort chapters within each unit
            course.Units.forEach(unit => {
                unit.Chapters.sort((a, b) => a.id - b.id);
            });

            res.status(200).json(course)
        } catch (err) {
            next(err);
        }
    }

    static async getAllCourses(req, res, next) {
        try {
            const courses = await Course.findAll({
                include: {
                    model: Unit,
                    include: {
                        model: Chapter,
                    }
                }
            });
            res.status(200).json(courses)
        } catch (err) {
            next(err);
        }
    }

    static async createCourseVideo(req, res, next) {
        try {
            const openai = req.openai;
            const { chapterName, chapterId, unitName, courseName } = req.body;

            // get search term from chapter
            const YTQuery = await openai.chat.completions.create({
                messages: [
                    {
                        role: "user",
                        content:
                            `Given the chapter ${chapterName} from the unit ${unitName}, ` +
                            "Provide me with a youtube search query regarding the following chapter for the given topic WITHOUT QUOTATION MARKS in 20 words or less.",
                    },
                ],
                model: "gpt-3.5-turbo-0125",
            });

            // search video based on query
            const { data: videoResult } = await axios(
                `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&order=relevance&q=${YTQuery?.choices[0]?.message?.content}&type=video&key=${process.env.YOUTUBE_API_KEY}&videoCaption=closedCaption`
            );

            const { thumbnails, title } = videoResult.items[0].snippet;
            const { videoId } = videoResult.items[0].id;

            // generate transcript
            const transcript = (await YoutubeTranscript.fetchTranscript(videoId, {
                lang: "en",
                country: "EN",
            })).map(t => t.text).join(" ").replace(/\n/g, "").slice(0, 500);

            // summarize transcript
            const summarizedTranscript = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        "role": "user",
                        "content": transcript +
                            `summarise the following transcript in 250 more or less words without referencing the video or channel itself, summarize only the educational content of the video.`
                    },
                ]
            })

            // update chapter db
            await Chapter.update({ videoThumbNail: thumbnails?.default?.url, videoTitle: title, videoId, videoTranscript: summarizedTranscript?.choices[0]?.message?.content }, {
                where: {
                    id: chapterId
                },
            });

            // generate questions
            for (let i = 0; i < 5; i++) {
                const options = [];
                let visitedQuestions = "";

                const question = await openai.chat.completions.create({
                    messages: [
                        {
                            role: "user",
                            content: `You are to generate a conceptual question regarding main topic of ${courseName} focusing on subtopic of ${title}. Give only one question that doesn't exist yet in ${visitedQuestions}`
                        }],
                    model: "gpt-3.5-turbo",
                });

                const generatedQuestion = question.choices[0]?.message.content;
                visitedQuestions += `${generatedQuestion}, `

                // insert to db question
                const addedQuestion = await Question.create({ ChapterId: chapterId, question: generatedQuestion })

                const answer = await openai.chat.completions.create({
                    messages: [
                        {
                            role: "user",
                            content: `In below 10 words, give me the answer to the question: ${generatedQuestion} without any precursor or additional words.`,
                        },
                    ],
                    model: "gpt-3.5-turbo",
                });

                const generatedAnswer = answer.choices[0]?.message.content;
                options.push({
                    option: generatedAnswer,
                    status: true,
                    QuestionId: addedQuestion.dataValues.id
                })

                let visitedOption = "";
                for (let i = 0; i < 3; i++) {
                    const option = await openai.chat.completions.create({
                        messages: [
                            {
                                role: "user",
                                content:
                                    `In below 10 words, give me a wrong answer to the question: ${generatedQuestion} without any precursor or additional words, that is not already in: ${visitedOption}.` +
                                    "Give wrong answers only that are still related.",
                            },
                        ],
                        model: "gpt-3.5-turbo-0125",
                    });

                    const wrongOption = option.choices[0]?.message.content;
                    visitedOption += ", " + wrongOption;
                    options.push({
                        option: wrongOption,
                        status: false,
                        QuestionId: addedQuestion.dataValues.id
                    });
                }

                await Option.bulkCreate(options);
            }

            res.status(200).json({ message: "Course video generated successfully" });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = CourseController;