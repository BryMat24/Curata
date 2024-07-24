export type Chapter = {
    chapterName: string;
    id: number;
    videoId: string;
    videoTranscript: string;
    Questions: Array<Question>;
};

export type Question = {
    question: string;
    Options: Array<Option>;
    id: number;
};

export type Option = {
    id: number;
    option: string;
    status: boolean;
};
