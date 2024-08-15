export interface Question{
    id: string,
    questionText: string,
    dropdownQuestion?: DropDownQuestionDef
    fillinQuestion?: string
}

export interface DropDownQuestionDef{
    alternatives: Array<{
        id: string
        alternativeText: string;
    }>;
}