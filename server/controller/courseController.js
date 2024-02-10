const { Course, Unit, Chapter } = require('../models');
const axios = require('axios');

class CourseController {
    static async createCourse(req, res, next) {
        try {
            const openai = req.openai;
            const { courseName, courseUnits } = req.body;

            // post the main course in db
            const addedCourse = await Course.create({ courseName });

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
                    include: Chapter
                }
            });
            res.status(200).json(course)
        } catch (err) {
            next(err);
        }
    }

    static async createCourseVideo(req, res, next) {
        try {
            const { chapterName, chapterId } = req.body;
            const { data } = await axios(
                `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&order=relevance&q=${chapterName}&type=video&key=${process.env.YOUTUBE_API_KEY}`
            );

            // insert to db
            const { thumbnails, title, channelId } = data.items[0].snippet;
            await User.update({ videoThumbNail: thumbnails?.default?.url, videoTitle: title, videoChannelId: channelId }, {
                where: {
                    id: chapterId
                },
            });

            // generate transcript


            // query transcript and summarize

            res.status(200).json({ message: "Course video generated successfully" });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = CourseController;