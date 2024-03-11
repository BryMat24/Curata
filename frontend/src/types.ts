export interface Course {
    id: number;
    courseName: string;
    Units: Array<Unit>;
    loading: false;
}

export interface Unit {
    unitName: string;
    Chapters: Array<Chapter>;
    id: number;
}

export interface Chapter {
    chapterName: string;
    id: number;
    videoId: string;
    videoTranscript: string;
    Questions: Array<Question>;
}

export interface Question {
    question: string;
    Options: Array<Option>;
    id: number;
}

export interface Option {
    id: number;
    option: string;
    status: boolean;
}
