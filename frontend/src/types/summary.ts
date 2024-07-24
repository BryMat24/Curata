export type Option = {
    id: number;
    option: string;
    status: boolean;
};

export type Summary = {
    [index: string]: string;
};

export type Question = {
    [index: string]: Array<Option>;
};
