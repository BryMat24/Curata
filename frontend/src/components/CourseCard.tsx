import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FunctionComponent } from "react";

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
        <Card className="w-[300px] h-[500px] duration-500 ease-in hover:scale-[1.03] hover:border hover:border-primary cursor-pointer shadow-md">
            <CardHeader>
                <CardTitle className="text-md">{courseName}</CardTitle>
            </CardHeader>
            <CardContent>
                <img
                    src={courseImage}
                    alt="course image"
                    className="h-[260px] w-[250px] rounded-md"
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
