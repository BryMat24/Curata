const OpenAI = require('openai');
const { Pinecone } = require("@pinecone-database/pinecone");

const setUpAPIKey = (req, res, next) => {
    req.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    req.pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
    });
    next();
}

module.exports = setUpAPIKey;