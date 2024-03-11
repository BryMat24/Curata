import { FunctionComponent, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Chapter } from "@/types";
import { Button } from "./ui/button";

interface QuizProps {
    chapter: Chapter | null;
}

const QuizSection: FunctionComponent<QuizProps> = ({ chapter }) => {
    const questions = chapter?.Questions;
    const [selected, setSelected] = useState<{ [key: number]: number }>([]);
    const [questionState, setQuestionState] = useState<{
        [key: number]: boolean;
    }>();

    const answerKey = useMemo(() => {
        const answer: { [key: number]: number } = {};
        questions?.forEach((question, index) => {
            answer[index] = question.Options.findIndex(
                (el) => el.status === true
            );
        });
        return answer;
    }, [questions]);

    const handleOnChange = (questionIndex: number, value: string) => {
        setSelected({ ...selected, [questionIndex]: Number(value) });
    };

    const checkAnswer = () => {
        let questionState: {
            [key: number]: boolean;
        } = {};

        for (let questionId in selected) {
            questionState[questionId] =
                selected[questionId] === answerKey[questionId];
        }

        setQuestionState(questionState);
    };

    return (
        <div className="mt-5 pl-8">
            <h1 className="text-3xl font-bold">Concept Check</h1>
            <div className="flex flex-col gap-5 mt-5">
                {questions?.map((question, index) => (
                    <div
                        key={index}
                        className={`border-2 p-5 rounded-[5px] ${
                            questionState &&
                            (questionState[index]
                                ? "bg-green-400"
                                : "bg-red-400")
                        }`}
                    >
                        <h2 className="font-bold mb-2 text-lg">
                            {question?.question}
                        </h2>
                        <RadioGroup
                            defaultValue=""
                            onValueChange={(value) =>
                                handleOnChange(index, value)
                            }
                        >
                            {question?.Options?.map((option, index) => (
                                <div
                                    className="flex items-center space-x-2 mt-1"
                                    key={index}
                                >
                                    <RadioGroupItem
                                        value={index + ""}
                                        id={question.id + index.toString()}
                                    />
                                    <Label
                                        htmlFor="option-one"
                                        className="text-[15px] leading-4"
                                    >
                                        {option?.option}
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    </div>
                ))}
            </div>
            <Button className="mt-2 w-full" size="lg" onClick={checkAnswer}>
                Check Answer
            </Button>
        </div>
    );
};

export default QuizSection;
