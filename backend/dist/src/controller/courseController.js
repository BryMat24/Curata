"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const client_1 = __importDefault(require("../prisma/client"));
const youtube_transcript_1 = require("youtube-transcript");
class CourseController {
    static getAllCourses(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courses = yield client_1.default.course.findMany({
                    include: {
                        units: {
                            include: {
                                chapters: true,
                            },
                        },
                    },
                });
                res.status(200).json(courses);
            }
            catch (err) {
                next(err);
            }
        });
    }
    static createCourse(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            try {
                const openai = req.openai;
                const { courseName, courseUnits } = req.body;
                // image search term
                const imageSearchTerm = yield (openai === null || openai === void 0 ? void 0 : openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "user",
                            content: `Please provide a good image search term for the title of a course about ${courseName}. This search term will be fed into the unsplash API to generate image for course thumbnails. Make sure it is appropriate for course thumbnails.`,
                        },
                    ],
                }));
                // unsplash
                const { data: unsplashImage } = yield axios_1.default.get(`https://api.unsplash.com/search/photos?page=1&query=${(_a = imageSearchTerm === null || imageSearchTerm === void 0 ? void 0 : imageSearchTerm.choices[0]) === null || _a === void 0 ? void 0 : _a.message.content}&client_id=${process.env.UNSPLASH_API_KEY}`);
                // post the main course in db
                const addedCourse = yield client_1.default.course.create({
                    data: {
                        courseName,
                        courseImage: (_b = unsplashImage === null || unsplashImage === void 0 ? void 0 : unsplashImage.results[0]) === null || _b === void 0 ? void 0 : _b.urls.small_s3,
                    },
                });
                // generate the book chapters
                for (const unit of courseUnits) {
                    const promptPrefix = `Given the unit: ${unit} of the main subject ${courseName}: `;
                    let visited = "";
                    const bookChaptersList = [];
                    for (let i = 0; i < 3; ++i) {
                        const response = yield (openai === null || openai === void 0 ? void 0 : openai.chat.completions.create({
                            model: "gpt-3.5-turbo",
                            messages: [
                                {
                                    role: "user",
                                    content: promptPrefix +
                                        `Provide me with a book chapter title for the unit in less than 10 words that doesn't exist yet in ${visited}.`,
                                },
                            ],
                        }));
                        const bookChapterName = (_e = (_d = (_c = response === null || response === void 0 ? void 0 : response.choices[0]) === null || _c === void 0 ? void 0 : _c.message) === null || _d === void 0 ? void 0 : _d.content) === null || _e === void 0 ? void 0 : _e.replace(/^"(.*)"$/, "$1");
                        bookChaptersList.push({ chapterName: bookChapterName });
                        visited += `${bookChapterName}, `;
                    }
                    // post the chapters and units to DB
                    const addedUnit = yield client_1.default.unit.create({
                        data: {
                            unitName: unit,
                            courseId: addedCourse.id,
                        },
                    });
                    const chaptersList = bookChaptersList.map((chapter) => {
                        return {
                            unitId: addedUnit.id,
                            chapterName: chapter.chapterName,
                        };
                    });
                    yield client_1.default.chapter.createMany({
                        data: chaptersList,
                    });
                }
                res.status(200).json({
                    message: "Course generated successfully",
                    course: addedCourse,
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    static createCourseVideo(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            try {
                const openai = req.openai;
                const { chapterName, chapterId, unitName, courseName } = req.body;
                // get search term from chapter
                const YTQuery = yield openai.chat.completions.create({
                    messages: [
                        {
                            role: "user",
                            content: `Given the chapter ${chapterName} from the unit ${unitName}, ` +
                                "Provide me with a youtube search query regarding the following chapter for the given topic WITHOUT QUOTATION MARKS in 20 words or less.",
                        },
                    ],
                    model: "gpt-3.5-turbo-0125",
                });
                // search video based on query
                const { data: videoResult } = yield (0, axios_1.default)(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&order=relevance&q=${(_b = (_a = YTQuery === null || YTQuery === void 0 ? void 0 : YTQuery.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content}&type=video&key=${process.env.YOUTUBE_API_KEY}&videoCaption=closedCaption`);
                const { thumbnails, title } = videoResult.items[0].snippet;
                const { videoId } = videoResult.items[0].id;
                const transcript = (yield youtube_transcript_1.YoutubeTranscript.fetchTranscript(videoId))
                    .map((t) => t.text)
                    .join(" ")
                    .replace(/\n/g, "")
                    .slice(0, 500);
                // summarize transcript
                const summarizedTranscript = yield openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            role: "user",
                            content: transcript +
                                `summarise the following transcript in 250 more or less words without referencing the video or channel itself, summarize only the educational content of the video.`,
                        },
                    ],
                });
                // update chapter db
                yield client_1.default.chapter.update({
                    data: {
                        videoThumbnail: (_c = thumbnails === null || thumbnails === void 0 ? void 0 : thumbnails.default) === null || _c === void 0 ? void 0 : _c.url,
                        videoTitle: title,
                        videoId,
                        videoTranscript: (_e = (_d = summarizedTranscript === null || summarizedTranscript === void 0 ? void 0 : summarizedTranscript.choices[0]) === null || _d === void 0 ? void 0 : _d.message) === null || _e === void 0 ? void 0 : _e.content,
                    },
                    where: {
                        id: chapterId,
                    },
                });
                const questionPromises = [];
                for (let i = 0; i < 5; i++) {
                    questionPromises.push(() => __awaiter(this, void 0, void 0, function* () {
                        var _a, _b;
                        const options = [];
                        const question = yield openai.chat.completions.create({
                            messages: [
                                {
                                    role: "user",
                                    content: `You are to generate a conceptual question regarding main topic of ${courseName} focusing on subtopic of ${title}. Give only one question.`,
                                },
                            ],
                            model: "gpt-3.5-turbo",
                        });
                        const generatedQuestion = (_a = question.choices[0]) === null || _a === void 0 ? void 0 : _a.message.content;
                        // insert to db question
                        const addedQuestion = yield client_1.default.question.create({
                            data: {
                                chapterId: chapterId,
                                question: generatedQuestion,
                            },
                        });
                        const answer = yield openai.chat.completions.create({
                            messages: [
                                {
                                    role: "user",
                                    content: `In below 10 words, give me the answer to the question: ${generatedQuestion} without any precursor or additional words.`,
                                },
                            ],
                            model: "gpt-3.5-turbo",
                        });
                        const generatedAnswer = (_b = answer.choices[0]) === null || _b === void 0 ? void 0 : _b.message.content;
                        options.push({
                            option: generatedAnswer,
                            status: true,
                            questionId: addedQuestion.id,
                        });
                        const wrongOptionsPromises = [];
                        for (let i = 0; i < 3; i++) {
                            const promise = openai.chat.completions.create({
                                messages: [
                                    {
                                        role: "user",
                                        content: `In below 10 words, give me a wrong answer to the question: ${generatedQuestion} without any precursor or additional words.` +
                                            `Make sure that it is related to the ${generatedQuestion} which must be in the scope of chapter ${chapterName} in ${courseName}`,
                                    },
                                ],
                                model: "gpt-3.5-turbo-0125",
                            });
                            wrongOptionsPromises.push(promise);
                        }
                        const results = yield Promise.all(wrongOptionsPromises);
                        results.forEach((result) => {
                            result.choices.forEach((choice) => {
                                options.push({
                                    option: choice.message.content,
                                    status: false,
                                    questionId: addedQuestion.id,
                                });
                            });
                        });
                        yield client_1.default.option.createMany({
                            data: options,
                        });
                    }));
                }
                yield Promise.all(questionPromises.map((fn) => fn()));
                res.status(200).json({
                    message: "Course video generated successfully",
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    static getCourse(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const course = yield client_1.default.course.findUnique({
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
                console.log(course);
                res.status(200).json(course);
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = CourseController;
