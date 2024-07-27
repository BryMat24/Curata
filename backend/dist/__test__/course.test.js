"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("../src/app"));
const supertest_1 = __importDefault(require("supertest"));
const client_1 = __importDefault(require("../src/prisma/client"));
// Mock 3rd party APIs
jest.mock("axios");
jest.mock("../src/prisma/client", () => {
    return {
        __esModule: true,
        default: {
            course: {
                findMany: jest.fn(),
                create: jest.fn(),
                findUnique: jest.fn(),
                createMany: jest.fn(),
                update: jest.fn(),
            },
            unit: {
                findMany: jest.fn(),
                create: jest.fn(),
                findUnique: jest.fn(),
                createMany: jest.fn(),
                update: jest.fn(),
            },
            option: {
                findMany: jest.fn(),
                create: jest.fn(),
                findUnique: jest.fn(),
                createMany: jest.fn(),
                update: jest.fn(),
            },
        },
    };
});
const mockCreate = jest.fn().mockImplementation(() => __awaiter(void 0, void 0, void 0, function* () {
    return "recipe text";
}));
jest.mock("openai", () => {
    return jest.fn().mockImplementation(() => {
        return {
            chat: {
                completions: {
                    create: mockCreate,
                },
            },
        };
    });
});
beforeEach(() => {
    jest.clearAllMocks();
});
describe("testing GET /course endpoints", () => {
    test("success should retrieve all courses and return status 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const courses = [
            {
                id: 1,
                courseName: "math",
                courseImage: "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1636690424408-4330adc3e583",
                units: [
                    {
                        id: 1,
                        unitName: "algebra",
                        courseId: 1,
                        chapters: [],
                    },
                ],
            },
        ];
        client_1.default.course.findMany.mockReturnValue(courses);
        const response = yield (0, supertest_1.default)(app_1.default).get("/course");
        expect(response.status).toBe(200);
        expect(response.body).toEqual(courses);
    }));
    test("database connection issue should return status 500", () => __awaiter(void 0, void 0, void 0, function* () {
        client_1.default.course.findMany.mockImplementation(() => {
            throw new Error("database connection error");
        });
        const response = yield (0, supertest_1.default)(app_1.default).get("/course");
        expect(response.status).toBe(500);
    }));
});
describe("testing GET /course/:id endpoints", () => {
    test("success should retrieve all courses and return status 200", () => __awaiter(void 0, void 0, void 0, function* () {
        const course = {
            id: 1,
            courseName: "math",
            courseImage: "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1636690424408-4330adc3e583",
            units: [
                {
                    id: 1,
                    unitName: "algebra",
                    courseId: 1,
                    chapters: [],
                },
            ],
        };
        client_1.default.course.findUnique.mockReturnValue(course);
        const response = yield (0, supertest_1.default)(app_1.default).get(`/course/${course.id}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(course);
    }));
    test("database connection issue should return status 500", () => __awaiter(void 0, void 0, void 0, function* () {
        client_1.default.course.findUnique.mockImplementation(() => {
            throw new Error("database connection error");
        });
        const response = yield (0, supertest_1.default)(app_1.default).get("/course/1");
        expect(response.status).toBe(500);
    }));
});
