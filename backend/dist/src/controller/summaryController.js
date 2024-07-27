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
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const uuid_1 = require("uuid");
const text_splitter_1 = require("langchain/text_splitter");
const document_1 = require("langchain/document");
class SummararyController {
    static uploadPdf(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const pc = req.pc;
            const openai = req.openai;
            const index = pc.index("curata-store");
            const splitter = new text_splitter_1.RecursiveCharacterTextSplitter({
                chunkSize: 2000,
                chunkOverlap: 1,
            });
            try {
                const file = (_a = req.files) === null || _a === void 0 ? void 0 : _a.file;
                const dataBuffer = file.data;
                const fileKey = req.body.fileKey;
                // extract the pdf and divide them into chunks
                const extractedPdf = yield (0, pdf_parse_1.default)(dataBuffer);
                const content = extractedPdf.text;
                const output = yield splitter.splitDocuments([
                    new document_1.Document({ pageContent: content }),
                ]);
                const promises = [];
                // upload it into chunks to the pinecone DB
                for (let i = 0; i < output.length; i++) {
                    promises.push(() => __awaiter(this, void 0, void 0, function* () {
                        var _a, _b, _c, _d, _e, _f;
                        const embedding = yield openai.embeddings.create({
                            model: "text-embedding-ada-002",
                            input: (_b = (_a = output[i]) === null || _a === void 0 ? void 0 : _a.pageContent) !== null && _b !== void 0 ? _b : "",
                            encoding_format: "float",
                        });
                        yield index.namespace(fileKey).upsert([
                            {
                                id: (0, uuid_1.v4)(),
                                values: (_d = (_c = embedding.data[0]) === null || _c === void 0 ? void 0 : _c.embedding) !== null && _d !== void 0 ? _d : [],
                                metadata: { content: (_f = (_e = output[i]) === null || _e === void 0 ? void 0 : _e.pageContent) !== null && _f !== void 0 ? _f : "" },
                            },
                        ]);
                    }));
                }
                yield Promise.all(promises.map((fn) => fn()));
                res.status(200).json({ message: "success" });
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        });
    }
    static getSummary(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pc = req.pc;
                const openai = req.openai;
                const index = pc.index("curata-store");
                const fileKey = req.body.fileKey;
                const headlines = [];
                // randomly select 4 chunks
                const headlinePromises = [];
                for (let i = 0; i < 4; i++) {
                    headlinePromises.push(() => __awaiter(this, void 0, void 0, function* () {
                        var _a, _b, _c;
                        const randomVector = Array.from({ length: 1536 }, () => Math.random() * 2 - 1);
                        const randomQueryResponse = yield index
                            .namespace(fileKey)
                            .query({
                            topK: 1,
                            vector: randomVector,
                            includeMetadata: true,
                        });
                        const headline = yield openai.chat.completions.create({
                            messages: [
                                {
                                    role: "user",
                                    content: `From the section: ${(_b = (_a = randomQueryResponse === null || randomQueryResponse === void 0 ? void 0 : randomQueryResponse.matches[0]) === null || _a === void 0 ? void 0 : _a.metadata) === null || _b === void 0 ? void 0 : _b.content}, 
                                can you give one major topic or headline of this section. Just give the headline in 5 words or less.`,
                                },
                            ],
                            model: "gpt-3.5-turbo",
                        });
                        headlines.push((_c = headline.choices[0]) === null || _c === void 0 ? void 0 : _c.message.content);
                    }));
                }
                yield Promise.all(headlinePromises.map((fn) => fn()));
                const summaryResponse = {};
                const summaryPromises = [];
                // for each headline find 5 related chunks
                for (let headline of headlines) {
                    summaryPromises.push(() => __awaiter(this, void 0, void 0, function* () {
                        var _a, _b, _c, _d;
                        const embedding = yield openai.embeddings.create({
                            model: "text-embedding-ada-002",
                            input: headline,
                            encoding_format: "float",
                        });
                        const queryResponse = yield index.namespace(fileKey).query({
                            vector: (_b = (_a = embedding.data[0]) === null || _a === void 0 ? void 0 : _a.embedding) !== null && _b !== void 0 ? _b : [],
                            topK: 5,
                            includeMetadata: true,
                        });
                        let sectionContent = "";
                        for (let section of queryResponse.matches) {
                            sectionContent += `${(_c = section.metadata) === null || _c === void 0 ? void 0 : _c.content} `;
                        }
                        const sectionSummary = yield openai.chat.completions.create({
                            messages: [
                                {
                                    role: "user",
                                    content: `From the section: ${sectionContent}, 
                                provide a summary of this section in 50 words or less,  
                                without referencing the section title at all, and directly start explaining the content without an opening.`,
                                },
                            ],
                            model: "gpt-3.5-turbo",
                        });
                        summaryResponse[headline] = (_d = sectionSummary.choices[0]) === null || _d === void 0 ? void 0 : _d.message.content;
                    }));
                }
                yield Promise.all(summaryPromises.map((fn) => fn()));
                res.status(200).json(summaryResponse);
            }
            catch (err) {
                next(err);
            }
        });
    }
    static getQuestion(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d, _e;
            const pc = req.pc;
            const openai = req.openai;
            const index = pc.index("curata-store");
            const fileKey = req.body.fileKey;
            try {
                // generate questions
                const questionResponse = {};
                for (let i = 0; i < 3; i++) {
                    const options = [];
                    let visitedQuestions = "";
                    const randomVector = Array.from({ length: 1536 }, () => Math.random() * 2 - 1);
                    const randomQueryResponse = yield index
                        .namespace(fileKey)
                        .query({
                        topK: 1,
                        vector: randomVector,
                        includeMetadata: true,
                    });
                    const question = yield openai.chat.completions.create({
                        messages: [
                            {
                                role: "user",
                                content: `You are to generate a conceptual question based on the content of ${(_b = (_a = randomQueryResponse === null || randomQueryResponse === void 0 ? void 0 : randomQueryResponse.matches[0]) === null || _a === void 0 ? void 0 : _a.metadata) === null || _b === void 0 ? void 0 : _b.content}. Give only one question that doesn't exist yet in ${visitedQuestions} and don't give a yes/no question`,
                            },
                        ],
                        model: "gpt-3.5-turbo",
                    });
                    const generatedQuestion = (_c = question.choices[0]) === null || _c === void 0 ? void 0 : _c.message.content;
                    visitedQuestions += `${generatedQuestion}, `;
                    // generate correct answer
                    const answer = yield openai.chat.completions.create({
                        messages: [
                            {
                                role: "user",
                                content: `In below 10 words, give me the answer to the question: ${generatedQuestion} without any precursor or additional words.`,
                            },
                        ],
                        model: "gpt-3.5-turbo",
                    });
                    const generatedAnswer = (_d = answer.choices[0]) === null || _d === void 0 ? void 0 : _d.message.content;
                    options.push({
                        option: generatedAnswer,
                        status: true,
                    });
                    let visitedOption = "";
                    for (let i = 0; i < 3; i++) {
                        const option = yield openai.chat.completions.create({
                            messages: [
                                {
                                    role: "user",
                                    content: `In below 10 words, give me a wrong answer to the question: ${generatedQuestion} without any precursor or additional words, that is not already in: ${visitedOption}.` +
                                        "Give wrong answers only that are still related.",
                                },
                            ],
                            model: "gpt-3.5-turbo-0125",
                        });
                        const wrongOption = (_e = option.choices[0]) === null || _e === void 0 ? void 0 : _e.message.content;
                        visitedOption += ", " + wrongOption;
                        options.push({
                            option: wrongOption,
                            status: false,
                        });
                    }
                    questionResponse[generatedQuestion] = options;
                }
                res.status(200).json(questionResponse);
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = SummararyController;
