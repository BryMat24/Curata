import { NextFunction, Request, Response } from "express";
import axios from "axios";
import prisma from "../prisma/client";
import { Chapter } from "../types/course";
import { YoutubeTranscript } from "youtube-transcript";

class CourseController {
    static async getAllCourses(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const courses = await prisma.course.findMany({
                include: {
                    units: {
                        include: {
                            chapters: true,
                        },
                    },
                },
            });
            res.status(200).json(courses);
        } catch (err) {
            next(err);
        }
    }

    static async createCourse(req: Request, res: Response, next: NextFunction) {
        try {
            const openai = req.openai;
            const { courseName, courseUnits } = req.body;

            // image search term
            const imageSearchTerm = await openai?.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "user",
                        content: `Please provide a good image search term for the title of a course about ${courseName}. This search term will be fed into the unsplash API to generate image for course thumbnails. Make sure it is appropriate for course thumbnails.`,
                    },
                ],
            });

            // unsplash
            const { data: unsplashImage } = await axios(
                `https://api.unsplash.com/search/photos?page=1&query=${imageSearchTerm?.choices[0]?.message.content}&client_id=${process.env.UNSPLASH_API_KEY}`
            );

            // post the main course in db
            const addedCourse = await prisma.course.create({
                data: {
                    courseName,
                    courseImage: unsplashImage?.results[0]?.urls.small_s3,
                },
            });

            // generate the book chapters
            for (const unit of courseUnits) {
                const promptPrefix = `Given the unit: ${unit} of the main subject ${courseName}: `;
                let visited = "";
                const bookChaptersList = [];

                for (let i = 0; i < 3; ++i) {
                    const response = await openai?.chat.completions.create({
                        model: "gpt-3.5-turbo",
                        messages: [
                            {
                                role: "user",
                                content:
                                    promptPrefix +
                                    `Provide me with a book chapter title for the unit in less than 10 words that doesn't exist yet in ${visited}.`,
                            },
                        ],
                    });

                    const bookChapterName =
                        response?.choices[0]?.message?.content?.replace(
                            /^"(.*)"$/,
                            "$1"
                        ) as string;
                    bookChaptersList.push({ chapterName: bookChapterName });
                    visited += `${bookChapterName}, `;
                }

                // post the chapters and units to DB
                const addedUnit = await prisma.unit.create({
                    data: {
                        unitName: unit,
                        courseId: addedCourse.id,
                    },
                });

                const chaptersList: Array<Chapter> = bookChaptersList.map(
                    (chapter) => {
                        return {
                            unitId: addedUnit.id,
                            chapterName: chapter.chapterName,
                        };
                    }
                );
                await prisma.chapter.createMany({
                    data: chaptersList,
                });
            }

            res.status(200).json({
                message: "Course generated successfully",
                course: addedCourse,
            });
        } catch (err) {
            next(err);
        }
    }

    static async createCourseVideo(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
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

            const transcript = (
                await YoutubeTranscript.fetchTranscript(videoId, {
                    lang: "en",
                    country: "EN",
                })
            )
                .map((t) => t.text)
                .join(" ")
                .replace(/\n/g, "")
                .slice(0, 500);

            // summarize transcript
            const summarizedTranscript = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "user",
                        content:
                            transcript +
                            `summarise the following transcript in 250 more or less words without referencing the video or channel itself, summarize only the educational content of the video.`,
                    },
                ],
            });

            // update chapter db
            await prisma.chapter.update({
                data: {
                    videoThumbnail: thumbnails?.default?.url,
                    videoTitle: title,
                    videoId,
                    videoTranscript:
                        summarizedTranscript?.choices[0]?.message?.content,
                },
                where: {
                    id: chapterId,
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
                            content: `You are to generate a conceptual question regarding main topic of ${courseName} focusing on subtopic of ${title}. Give only one question that doesn't exist yet in ${visitedQuestions}`,
                        },
                    ],
                    model: "gpt-3.5-turbo",
                });

                const generatedQuestion = question.choices[0]?.message.content;
                visitedQuestions += `${generatedQuestion}, `;

                // insert to db question
                const addedQuestion = await prisma.question.create({
                    data: {
                        chapterId: chapterId,
                        question: generatedQuestion as string,
                    },
                });

                const answer = await openai.chat.completions.create({
                    messages: [
                        {
                            role: "user",
                            content: `In below 10 words, give me the answer to the question: ${generatedQuestion} without any precursor or additional words.`,
                        },
                    ],
                    model: "gpt-3.5-turbo",
                });

                const generatedAnswer = answer.choices[0]?.message
                    .content as string;
                options.push({
                    option: generatedAnswer,
                    status: true,
                    questionId: addedQuestion.id,
                });

                const wrongOptionsPromise = [];
                for (let i = 0; i < 3; i++) {
                    const promise = openai.chat.completions.create({
                        messages: [
                            {
                                role: "user",
                                content:
                                    `In below 10 words, give me a wrong answer to the question: ${generatedQuestion} without any precursor or additional words.` +
                                    "Make sure that the generated wrong answer is still related to the question.",
                            },
                        ],
                        model: "gpt-3.5-turbo-0125",
                    });

                    wrongOptionsPromise.push(promise);
                }

                const results = await Promise.all(wrongOptionsPromise);
                results.forEach((result) => {
                    result.choices.forEach((choice) => {
                        options.push({
                            option: choice.message.content,
                            status: false,
                            questionId: addedQuestion.id,
                        });
                    });
                });

                await prisma.option.createMany({
                    data: options,
                });
            }

            res.status(200).json({
                message: "Course video generated successfully",
            });
        } catch (err) {
            next(err);
        }
    }

    static async getCourse(req: Request, res: Response, next: NextFunction) {
        try {
            const course = await prisma.course.findUnique({
                where: {
                    id: Number(req.params.id),
                },
                include: {
                    units: {
                        include: {
                            chapters: {
                                include: {
                                    questions: {
                                        include: {
                                            options: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            res.status(200).json(course);
        } catch (err) {
            next(err);
        }
    }
}

export default CourseController;
