"use client";
import { FunctionComponent, useEffect, useState } from "react";
import CourseCard from "@/components/CourseCard";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { apiClient } from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";

interface Props {}

interface Course {
    courseImage: string;
    courseName: string;
    Units: Unit[];
    id: number;
}

interface Unit {
    unitName: string;
}

const Course: FunctionComponent<Props> = () => {
    const [courses, setCourses] = useState<Array<Course>>([]);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        getAllCourses();
    }, []);

    const getAllCourses = async () => {
        try {
            setLoading(true);
            const { data } = await apiClient("/course");
            setCourses(data);
            setLoading(false);
        } catch (err) {
            toast({
                title: "Error occured!",
                description: `${err}`,
            });
        }
    };

    return (
        <div className="py-28 px-24 flex flex-wrap gap-5 justify-center">
            <Link href={`/course/create`}>
                <Card className="border-ghost flex h-[500px] w-[300px] items-center justify-center outline-dashed duration-700 ease-in hover:scale-[1.03] hover:border hover:outline-primary outline-[#E7E5E4]">
                    <Plus className="h-10 w-10" />
                </Card>
            </Link>
            {courses.map((course, index) => (
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
