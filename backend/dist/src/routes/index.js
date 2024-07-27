"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const courseRouter_1 = __importDefault(require("./courseRouter"));
const summaryRoutes_1 = __importDefault(require("./summaryRoutes"));
const router = express_1.default.Router();
router.use("/course", courseRouter_1.default);
router.use("/pdf", summaryRoutes_1.default);
exports.default = router;
