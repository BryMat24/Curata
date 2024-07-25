export type Course = {
    id: number;
    courseName: string;
    units: Array<Unit>;
    loading: false;
    courseImage: string;
};

export type Unit = {
    unitName: string;
    chapters: Array<Chapter>;
    id: number;
};

export type Chapter = {
    chapterName: string;
    id: number;
    videoId: string;
    videoTranscript: string;
    questions: Array<Question>;
};

export type Question = {
    question: string;
    options: Array<Option>;
    id: number;
};

export type Option = {
    id: number;
    option: string;
    status: boolean;
};
