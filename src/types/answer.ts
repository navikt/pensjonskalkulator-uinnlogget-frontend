export interface Answer{
    questionId: number;
    dropdownQuestionAnswer?: DropDownAnswerDef;
    fillinQuestionAnswer?: string;
    //multiple choice question?
    //Dropdown question? 
    //Fill inn question?
}

export interface DropDownAnswerDef{
    alternativeId: number;
}