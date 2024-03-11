"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FunctionComponent } from "react";
import { Separator } from "./ui/separator";
import { Course } from "@/types";

interface CourseSidebarProps {
    course: Course | null;
    currentChapterId: number | null;
}

const CourseSidebar: FunctionComponent<CourseSidebarProps> = ({
    course,
    currentChapterId,
}) => {
    return (
        <div className="absolute min-h-screen w-[400px] overflow-y-scroll rounded-r-3xl bg-[#F5F5F4] p-6 mt-[80px]">
            <h1 className="text-4xl font-bold">{course?.courseName}</h1>
            {course?.Units?.map((unit, unitIndex) => {
                return (
                    <div key={unit.id} className="mt-4">
                        <h2 className="text-sm uppercase text-secondary-foreground/60">
                            Unit {unitIndex + 1}
                        </h2>
                        <h2 className="text-2xl font-bold">{unit?.unitName}</h2>
                        {unit.Chapters.map((chapter, chapterIndex) => {
                            return (
                                <div key={chapter.id}>
                                    <Link
                                        href={`/course/${course?.id}/${unitIndex}/${chapterIndex}`}
                                        className={cn(
                                            "text-secondary-foreground/60",
                                            {
                                                "font-bold text-green-500":
                                                    chapter?.id ==
                                                    currentChapterId,
                                            }
                                        )}
                                    >
                                        {chapter?.chapterName}
                                    </Link>
                                </div>
                            );
                        })}
                        <Separator className="mt-2 bg-gray-500 text-gray-500" />
                    </div>
                );
            })}
        </div>
    );
};

export default CourseSidebar;
