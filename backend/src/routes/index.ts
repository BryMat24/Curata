import express from "express";
import courseRouter from "./courseRouter";
import summaryRouter from "./summaryRoutes";

const router = express.Router();

router.use("/course", courseRouter);
router.use("/pdf", summaryRouter);

export default router;
