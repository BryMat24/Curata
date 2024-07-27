import express from "express";
import { OpenAI } from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { Buffer } from "buffer";

declare global {
    namespace Express {
        interface Request {
            openai: OpenAI;
            pc: Pinecone;
            userId?: number;
        }
    }
}
