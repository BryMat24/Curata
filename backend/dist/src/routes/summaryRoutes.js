"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const summaryController_1 = __importDefault(require("../controller/summaryController"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
router.post("/summary", summaryController_1.default.getSummary);
router.post("/upload", (0, express_fileupload_1.default)(), summaryController_1.default.uploadPdf);
router.post("/question", summaryController_1.default.getQuestion);
exports.default = router;
