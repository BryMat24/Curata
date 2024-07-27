import express from "express";
const router = express.Router();
import CourseController from "../controller/courseController";

router.get("/", CourseController.getAllCourses);
router.post("/", CourseController.createCourse);
router.put("/", CourseController.createCourseVideo);
router.get("/:id", CourseController.getCourse);

export default router;
