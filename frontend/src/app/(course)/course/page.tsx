"use client";
import { FC } from "react";
import CourseCard from "@/components/CourseCard";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Course } from "@/types/course";
import { useFetch } from "@/hooks/useFetch";

interface Props {}

const Course: FC<Props> = () => {
    const {
        data: courses,
        loading,
        error,
    } = useFetch<Array<Course>>("/course");

    return (
        <div className="py-28 px-24 flex flex-wrap gap-5 justify-center">
            <Link href={`/course/create`}>
                <Card className="border-ghost flex h-[500px] w-[300px] items-center justify-center outline-dashed duration-700 ease-in hover:scale-[1.03] hover:border hover:outline-primary outline-[#E7E5E4] dark:bg-dark-blue">
                    <Plus className="h-10 w-10" />
                </Card>
            </Link>
            {courses?.map((course, index) => (
                <Link href={`/course/${course?.id}/0/0`} key={index}>
                    <CourseCard
                        courseImage={course?.courseImage}
                        courseName={course?.courseName}
                        courseUnits={course?.Units}
                    />
                </Link>
            ))}
        </div>
    );
};

export default Course;
