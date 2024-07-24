export type Course = {
    id: number;
    courseName: string;
    Units: Array<Unit>;
    loading: false;
};

export type Unit = {
    unitName: string;
    Chapters: Array<Chapter>;
    id: number;
};

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
