import React from "react";
import { Unit, Chapter } from "@/types";

type Props = {
    chapter: Chapter | null;
    unit: Unit | null;
    unitIndex: number;
    chapterIndex: number;
};

const MainVideoSummary = ({ unitIndex, chapter, chapterIndex }: Props) => {
    return (
        <div className="mt-16 flex-[2]">
            <h4 className="text-sm uppercase text-secondary-foreground/60">
                Unit {unitIndex + 1} &bull; Chapter {chapterIndex + 1}
            </h4>
            <h1 className="text-4xl font-bold">{chapter?.chapterName}</h1>
            <iframe
                title="chapter video"
                className="my-4 mt-4 aspect-video max-h-60 w-full"
                src={`https://www.youtube.com/embed/${chapter?.videoId}`}
                allowFullScreen
            />
            <div className="mt-4 h-[360px] overflow-y-scroll">
                <h3 className="text-3xl font-semibold">Summary</h3>
                <p className="mt-2 text-secondary-foreground/80">
                    {chapter?.videoTranscript}
                </p>
            </div>
        </div>
    );
};

export default MainVideoSummary;
