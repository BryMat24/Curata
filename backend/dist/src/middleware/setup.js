"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = __importDefault(require("openai"));
const pinecone_1 = require("@pinecone-database/pinecone");
const setupAPIKey = (req, res, next) => {
    req.openai = new openai_1.default({
        apiKey: process.env.OPENAI_API_KEY,
    });
    console.log(req.openai);
    req.pc = new pinecone_1.Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
    });
    next();
};
exports.default = setupAPIKey;
