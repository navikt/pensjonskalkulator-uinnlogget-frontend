export interface Question{
    id: number,
    title: string,
    description: string,
    type: 'radio' | 'dropdown' | 'input' 
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