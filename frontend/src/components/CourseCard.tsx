import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FunctionComponent } from "react";
import Image from "next/image";

interface Props {
    courseImage: string;
    courseName: string;
    courseUnits: Unit[];
}

interface Unit {
    unitName: string;
}

const CourseCard: FunctionComponent<Props> = ({
    courseImage,
    courseName,
    courseUnits,
}) => {
    return (
        <Card className="w-[300px] h-[500px] duration-500 ease-in hover:scale-[1.03] hover:border hover:border-primary cursor-pointer shadow-md dark:bg-dark-blue">
            <CardHeader>
                <CardTitle className="text-md">{courseName}</CardTitle>
            </CardHeader>
            <CardContent>
                <Image
                    src={courseImage}
                    alt="course image"
                    className="rounded-md h-[260px] w-[250px]"
                    height={260}
                    width={250}
                />
            </CardContent>
            <CardContent className="text-center">
                {courseUnits.map((unit, index) => (
                    <p key={index}>{unit?.unitName}</p>
                ))}
            </CardContent>
        </Card>
    );
};

export default CourseCard;
