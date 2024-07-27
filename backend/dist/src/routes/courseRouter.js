"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const courseController_1 = __importDefault(require("../controller/courseController"));
router.get("/", courseController_1.default.getAllCourses);
router.post("/", courseController_1.default.createCourse);
router.put("/", courseController_1.default.createCourseVideo);
router.get("/:id", courseController_1.default.getCourse);
exports.default = router;
