const express = require('express');
const router = express.Router();
const Summarize = require('../controller/summarizeController');
const fileUpload = require('express-fileupload');

router.post("/summary", Summarize.getSummary);
router.post("/upload", fileUpload(), Summarize.uploadPdf);
router.post("/question", Summarize.getQuestion);

module.exports = router;