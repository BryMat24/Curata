const pdf = require('pdf-parse');
const { v4: uuidv4 } = require('uuid');
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { Document } = require("langchain/document");

class Summarize {
    static async uploadPdf(req, res, next) {
        const pc = req.pc;
        const openai = req.openai;
        const index = pc.index("curata-store");
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 2000,
            chunkOverlap: 1,
        });

        try {
            const file = req.files.file;
            const dataBuffer = file.data;
            const fileKey = req.body.fileKey;

            // extract the pdf and divide them into chunks
            const extractedPdf = await pdf(dataBuffer);
            const content = extractedPdf.text;
            const output = await splitter.splitDocuments([
                new Document({ pageContent: content }),
            ]);

            // upload it into chunks to the pinecone DB
            for (let i = 0; i < output.length; i++) {
                const embedding = await openai.embeddings.create({
                    model: "text-embedding-ada-002",
                    input: output[i]?.pageContent ?? "",
                    encoding_format: "float",
                });

                await index.namespace(fileKey).upsert([
                    {
                        id: uuidv4(),
                        values: embedding.data[0]?.embedding ?? [],
                        metadata: { content: output[i]?.pageContent ?? "" },
                    },
                ]);
            }

            res.status(200).json({ message: "success" })
        } catch (err) {
            next(err);
        }
    }

    static async getSummary(req, res, next) {
        try {
            const pc = req.pc;
            const openai = req.openai;
            const index = pc.index("curata-store");
            const fileKey = req.body.fileKey;
            const headlines = [];
            console.log(fileKey);

            // randomly select 4 chunks
            for (let i = 0; i < 4; i++) {
                const randomVector = Array.from({ length: 1536 }, () => Math.random() * 2 - 1);
                const randomQueryResponse = await index.namespace(fileKey).query({
                    topK: 1,
                    vector: randomVector,
                    includeMetadata: true,
                });

                console.log(randomQueryResponse?.matches[0]?.metadata?.content);

                const headline = await openai.chat.completions.create({
                    messages: [
                        {
                            role: "user",
                            content: `From the section: ${randomQueryResponse?.matches[0]?.metadata?.content}, 
                            can you give one major topic or headline of this section. Just give the headline in 5 words or less.`,
                        },
                    ],
                    model: "gpt-3.5-turbo",
                });

                headlines.push(headline.choices[0]?.message.content);
            }

            const summaryResponse = {};
            // for each headline find 5 related chunks
            for (let headline of headlines) {
                const embedding = await openai.embeddings.create({
                    model: "text-embedding-ada-002",
                    input: headline,
                    encoding_format: "float",
                });

                const queryResponse = await index.namespace(fileKey).query({
                    vector: embedding.data[0]?.embedding ?? [],
                    topK: 5,
                    includeMetadata: true,
                });

                let sectionContent = "";
                for (let section of queryResponse.matches) {
                    sectionContent += `${section.metadata.content} `
                }

                const sectionSummary = await openai.chat.completions.create({
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

                summaryResponse[headline] = sectionSummary.choices[0]?.message.content;
            }

            res.status(200).json({ message: "success", data: summaryResponse });
        } catch (err) {
            next(err);
        }
    }

    static async getQuestion(req, res, next) {
        const pc = req.pc;
        const openai = req.openai;
        const index = pc.index("curata-store");
        const fileKey = req.body.fileKey;

        try {
            // generate questions
            const questionResponse = {};
            for (let i = 0; i < 5; i++) {
                const options = [];
                let visitedQuestions = "";

                const randomVector = Array.from({ length: 1536 }, () => Math.random() * 2 - 1);
                const randomQueryResponse = await index.namespace(fileKey).query({
                    topK: 1,
                    vector: randomVector,
                    includeMetadata: true,
                });

                const question = await openai.chat.completions.create({
                    messages: [
                        {
                            role: "user",
                            content: `You are to generate a conceptual question based on the content of ${randomQueryResponse?.matches[0]?.metadata?.content}. Give only one question that doesn't exist yet in ${visitedQuestions} and don't give a yes/no question`
                        }],
                    model: "gpt-3.5-turbo",
                });

                const generatedQuestion = question.choices[0]?.message.content;
                visitedQuestions += `${generatedQuestion}, `

                // generate correct answer
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
                    })
                }

                questionResponse[generatedQuestion] = options;
            }

            res.status(200).json({ message: "success", data: questionResponse });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = Summarize;