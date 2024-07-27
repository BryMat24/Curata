"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Menubar, MenubarMenu, MenubarTrigger } from "@/components/ui/menubar";
import Image from "next/image";
import { useContext, useState } from "react";
import { ThemeContext } from "@/context/themeContext";

export default function Home() {
    const [selectedMenu, setSelectedMenu] = useState("coursegen");
    const { theme } = useContext(ThemeContext);

    return (
        <main
            className={`${
                theme === "light" ? "animated-background" : ""
            } dark:bg-black`}
        >
            <div className="min-h-screen flex flex-col items-center justify-center gap-5">
                <h1 className="text-5xl font-bold">Introducing Curata...</h1>
                <p className="text-2xl">
                    Your all-in-one AI Study Assistant curated to elevate your
                    learning experience
                </p>
                <Link href="/course">
                    <Button>
                        Try Curata{" "}
                        <svg
                            width="0.625rem"
                            viewBox="0 0 10 10"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="ml-1"
                        >
                            <path
                                d="M1 9L9 1M9 1H2.5M9 1V7.22222"
                                stroke="currentColor"
                                stroke-width="1.25"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            ></path>
                        </svg>
                    </Button>
                </Link>
            </div>
            <div className="h-screen p-12">
                <div className="flex justify-center">
                    <Menubar>
                        <MenubarMenu>
                            <MenubarTrigger
                                onClick={() => setSelectedMenu("coursegen")}
                            >
                                CourseGen Feature
                            </MenubarTrigger>
                        </MenubarMenu>
                        <MenubarMenu>
                            <MenubarTrigger
                                onClick={() => setSelectedMenu("pdf")}
                            >
                                PDF Feature
                            </MenubarTrigger>
                        </MenubarMenu>
                        <MenubarMenu>
                            <MenubarTrigger
                                onClick={() => setSelectedMenu("limitation")}
                            >
                                Limitations
                            </MenubarTrigger>
                        </MenubarMenu>
                    </Menubar>
                </div>
                {selectedMenu === "pdf" ? (
                    <div className="flex my-32 mx-28 gap-32">
                        <div className="rounded-md relative w-[650px] h-[400px]">
                            <Image
                                src="/pdf.jpg"
                                alt="pdf"
                                fill={true}
                                className="rounded-md"
                            ></Image>
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                            <h1 className="font-bold text-3xl">PDF Upload</h1>
                            <p className="text-wrap text-lg mt-3">
                                Personalize your learning based on your focus
                                today. Summarize your notes and generates
                                quizzes instantly!
                            </p>
                        </div>
                    </div>
                ) : selectedMenu === "coursegen" ? (
                    <div className="flex my-32 mx-28 gap-32">
                        <div className="flex-1 flex flex-col justify-center">
                            <h1 className="font-bold text-3xl">
                                Course Generator
                            </h1>
                            <p className="text-wrap text-lg mt-3">
                                Elavate your learning experience by generating
                                your own course roadmaps, summaries and quizzes.
                            </p>
                        </div>
                        <div className="rounded-md relative w-[650px] h-[400px]">
                            <Image
                                src="/coursegen.png"
                                alt="coursegen"
                                fill={true}
                                className="rounded-md"
                            ></Image>
                        </div>
                    </div>
                ) : (
                    <div className="flex my-24 mx-28 flex-col items-center gap-12">
                        <h1 className="font-bold text-3xl">Limitations</h1>
                        <ul className="px-36 text-lg flex flex-col gap-5">
                            <li className="list-disc">
                                <span className="font-bold">
                                    Subject Coverage:
                                </span>{" "}
                                Curata may not cover all possible subjects
                                comprehensively. The AI&apos;s knowledge is
                                limited to the data it has been trained on,
                                which may not include every niche or emerging
                                field.
                            </li>
                            <li className="list-disc">
                                <span className="font-bold">
                                    Depth of Content:
                                </span>{" "}
                                While summaries and quizzes can provide a good
                                overview, they might not cover every detail or
                                nuance of the original material. For complex
                                subjects, it&apos;s recommended to use Curata as
                                a supplementary tool alongside more in-depth
                                study resources..
                            </li>
                            <li className="list-disc">
                                <span className="font-bold">
                                    AI Limitations:
                                </span>{" "}
                                The AI may occasionally produce summaries or
                                quiz questions that are inaccurate or lack
                                context. It&apos;s important to cross-reference
                                the generated content with trusted sources.
                            </li>
                            <li className="list-disc">
                                <span className="font-bold">
                                    Content Quality and Originality:
                                </span>{" "}
                                The quality of the generated content can vary.
                                It should not be relied upon for creating
                                entirely original research or academic work.
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </main>
    );
}
