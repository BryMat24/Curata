"use client";
import { useParams } from "next/navigation";
import { FunctionComponent, useEffect, useState } from "react";
import { apiClient } from "@/lib/axios";
import CourseSidebar from "@/components/CourseSidebar";
import MainVideoSummary from "@/components/MainVideoSummary";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import QuizSection from "@/components/QuizSection";
import { Unit, Course, Chapter } from "@/types";

interface Props {}

const CourseDetail: FunctionComponent<Props> = () => {
    const [course, setCourses] = useState<Course>();
    const { slug } = useParams();
    const [courseId, unitIndexParam, chapterIndexParam] = slug;
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getCourses();
    }, []);

    const getCourses = async () => {
        try {
            const { data } = await apiClient.get<Course>(`/course/${courseId}`);
            setCourses(data);
        } catch (err) {
            console.log(err);
        }
    };

    if (!unitIndexParam || !chapterIndexParam) {
        return <>Something went wrong</>;
    }
    const unitIndex = parseInt(unitIndexParam);
    const chapterIndex = parseInt(chapterIndexParam);

    const unit = course?.Units[unitIndex];
    const chapter = unit?.Chapters[chapterIndex];

    const nextChapter = unit?.Chapters[chapterIndex + 1];
    const prevChapter = unit?.Chapters[chapterIndex - 1];

    return (
        <>
            <CourseSidebar
                course={course || null}
                currentChapterId={chapter?.id || null}
            />
            <div className="my-2 flex ml-[400px] pl-8 pt-12 mr-5">
                <MainVideoSummary
                    chapter={chapter as Chapter}
                    chapterIndex={chapterIndex}
                    unit={unit as Unit}
                    unitIndex={unitIndex}
                />
                <div className="h-screen w-1/3 overflow-y-scroll pt-12">
                    <QuizSection chapter={chapter || null} />
                </div>
            </div>

            <div className="mt-5 h-[1px] flex-[1] bg-gray-500 text-gray-500 ml-[430px] mr-5" />
            <div className="flex pb-8 ml-[400px] px-5">
                {prevChapter && (
                    <Link
                        href={`/course/${course?.id}/${unitIndex}/${
                            chapterIndex - 1
                        }`}
                        className="mr-auto mt-4 flex w-fit"
                    >
                        <div className="flex items-center">
                            <ChevronLeft className="mr-1 h-6 w-6" />
                            <div className="flex flex-col items-start">
                                <span className="text-sm text-secondary-foreground/60">
                                    Previous
                                </span>
                                <span className="text-xl font-bold">
                                    {prevChapter.chapterName}
                                </span>
                            </div>
                        </div>
                    </Link>
                )}

                {nextChapter && (
                    <Link
                        href={`/course/${course?.id}/${unitIndex}/${
                            chapterIndex + 1
                        }`}
                        className="ml-auto mt-4 flex w-fit"
                    >
                        <div className="flex items-center">
                            <div className="flex flex-col items-start">
                                <span className="text-sm text-secondary-foreground/60">
                                    Next
                                </span>
                                <span className="text-xl font-bold">
                                    {nextChapter.chapterName}
                                </span>
                            </div>
                            <ChevronRight className="ml-1 h-6 w-6" />
                        </div>
                    </Link>
                )}
            </div>
        </>
    );
};

export default CourseDetail;
