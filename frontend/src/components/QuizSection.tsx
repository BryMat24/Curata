import { FunctionComponent, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "./ui/button";
import { Chapter } from "@/types/course";

interface QuizProps {
    chapter: Chapter | null;
}

const QuizSection: FunctionComponent<QuizProps> = ({ chapter }) => {
    const questions = chapter?.questions;
    const [selected, setSelected] = useState<{ [key: number]: number }>([]);
    const [questionState, setQuestionState] = useState<{
        [key: number]: boolean;
    }>();

    const answerKey = useMemo(() => {
        const answer: { [key: number]: number } = {};
        questions?.forEach((question, index) => {
            answer[index] = question.options.findIndex(
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
                            {question?.options?.map((option, index) => (
                                <div
                                    key={index}
                                    className="flex space-x-2 mt-1"
                                >
                                    <div>
                                        <RadioGroupItem
                                            value={index + ""}
                                            id={question.id + index.toString()}
                                            className="w-[12px] h-[12px]"
                                        />
                                    </div>

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
            <Button
                className="mt-2 w-full dark:bg-dark-blue dark:text-green-500"
                size="lg"
                onClick={checkAnswer}
            >
                Check Answer
            </Button>
        </div>
    );
};

export default QuizSection;
