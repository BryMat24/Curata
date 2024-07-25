import express from "express";
import courseRouter from "./courseRouter";

const router = express.Router();

router.use("/course", courseRouter);

export default router;
