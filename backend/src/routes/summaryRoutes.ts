import express from "express";
const router = express.Router();
import SummararyController from "../controller/summaryController";
import fileUpload from "express-fileupload";

router.post("/summary", SummararyController.getSummary);
router.post("/upload", fileUpload(), SummararyController.uploadPdf);
router.post("/question", SummararyController.getQuestion);

export default router;
