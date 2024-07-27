import app from "../src/app";
import request from "supertest";
import prisma from "../src/prisma/client";
import axios from "axios";

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

const mockCreate = jest.fn().mockImplementation(async () => {
    return "recipe text";
});
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
    test("success should retrieve all courses and return status 200", async () => {
        const courses = [
            {
                id: 1,
                courseName: "math",
                courseImage:
                    "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1636690424408-4330adc3e583",
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

        (prisma.course.findMany as jest.Mock).mockReturnValue(courses);
        const response = await request(app).get("/course");
        expect(response.status).toBe(200);
        expect(response.body).toEqual(courses);
    });

    test("database connection issue should return status 500", async () => {
        (prisma.course.findMany as jest.Mock).mockImplementation(() => {
            throw new Error("database connection error");
        });

        const response = await request(app).get("/course");
        expect(response.status).toBe(500);
    });
});

describe("testing GET /course/:id endpoints", () => {
    test("success should retrieve all courses and return status 200", async () => {
        const course = {
            id: 1,
            courseName: "math",
            courseImage:
                "https://s3.us-west-2.amazonaws.com/images.unsplash.com/small/photo-1636690424408-4330adc3e583",
            units: [
                {
                    id: 1,
                    unitName: "algebra",
                    courseId: 1,
                    chapters: [],
                },
            ],
        };

        (prisma.course.findUnique as jest.Mock).mockReturnValue(course);
        const response = await request(app).get(`/course/${course.id}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(course);
    });

    test("database connection issue should return status 500", async () => {
        (prisma.course.findUnique as jest.Mock).mockImplementation(() => {
            throw new Error("database connection error");
        });

        const response = await request(app).get("/course/1");
        expect(response.status).toBe(500);
    });
});
