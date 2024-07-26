import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { RequestHandler } from "express";

const setupAPIKey: RequestHandler = (req, res, next) => {
    req.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY as string,
    });

    console.log(req.openai);

    req.pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY as string,
    });

    next();
};

export default setupAPIKey;
