"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// use `prisma` in your application to read and write data in your DB
exports.default = prisma;
