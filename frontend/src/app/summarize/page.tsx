"use client";
import { v4 as uuidv4 } from "uuid";
import { FunctionComponent, useState } from "react";
import { UploadCloud } from "lucide-react";
import { Input } from "@/components/ui/input";
import { apiClient } from "@/lib/axios";
import { MoonLoader } from "react-spinners";
import QuizSection from "@/components/QuizSection";
import { Chapter } from "@/types";

interface Props {}

const Summarize: FunctionComponent<Props> = () => {
    const [summary, setSummary] = useState();
    const [question, setQuestion] = useState();
    const [loading, setLoading] = useState({ status: false, text: "" });

    const handleUpload = async (e: any) => {
        try {
            const formData = new FormData();
            const file = e.target.files[0];
            const fileKey = `${file.name}-${uuidv4()}`;

            if (file !== undefined) {
                formData.append("file", file);
                formData.append("fileKey", fileKey);
            }

            setLoading({ status: true, text: "Parsing PDF..." });
            await apiClient.post("/pdf/upload", formData);

            setLoading({
                status: true,
                text: "Generating Content Summary...",
            });

            setTimeout(async () => {
                const [summary, question] = await Promise.all([
                    apiClient.post("/pdf/summary", { fileKey: fileKey }),
                    apiClient.post("/pdf/question", { fileKey: fileKey }),
                ]);

                setLoading({ status: false, text: "" });
                setSummary(summary.data);
                setQuestion(question.data);
            }, 10000);
        } catch (err) {
            console.log(err);
        }
    };

    if (loading.status) {
        return (
            <div className="h-screen flex justify-center items-center flex-col gap-5">
                <MoonLoader
                    color="#000"
                    loading={loading.status}
                    size={60}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
                <div className="font-bold text-xl">{loading.text}</div>
            </div>
        );
    }

    const chapter = {
        Questions: question
            ? Object.entries(question?.data).map(([question, options]) => ({
                  question,
                  Options: options.map(({ option, status }) => ({
                      option,
                      status,
                  })),
              }))
            : [],
    };

    return summary && question ? (
        <div className="pt-[120px] px-[50px] pb-[50px] flex">
            <div
                className="border bg-card text-card-foreground shadow rounded-xl px-4 py-4 h-[80vh] overflow-y-scroll"
                style={{ flex: "70%" }}
            >
                <h1 className="px-4 pt-4 text-3xl font-bold">
                    AI Generated Summary
                </h1>
                {Object.entries(summary?.data).map(
                    ([title, content], index) => (
                        <div className="p-6 py-4" key={index}>
                            <h1 className="mb-2 text-xl font-bold">{title}</h1>
                            <p>{content}</p>
                        </div>
                    )
                )}
            </div>
            <div className="h-[80vh] overflow-y-scroll" style={{ flex: "30%" }}>
                <QuizSection chapter={chapter as Chapter} />
            </div>
        </div>
    ) : (
        <div className="flex flex-col justify-center items-center pt-28">
            <h1 className="text-2xl font-bold">
                Upload your PDF for an AI Generated Summary and Knowledge Check
                🤖🪄
            </h1>
            <div className="max-w-[700px] w-full h-[170px] mt-8 outline-dashed rounded-[10px] outline-[#E7E5E4] flex justify-center items-center cursor-pointer relative">
                <Input
                    className="absolute inset-0 w-full h-full opacity-0"
                    type="file"
                    onChange={handleUpload}
                    accept="application/pdf"
                />
                <div>
                    <UploadCloud className="mx-auto h-[54px] w-[54px]" />
                    <p className="font-medium">Drop your PDF document here!</p>
                </div>
            </div>
        </div>
    );
};

export default Summarize;
