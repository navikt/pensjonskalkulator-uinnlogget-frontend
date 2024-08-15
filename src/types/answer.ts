export interface Answer{
    questionId: string;
    dropdownQuestionAnswer?: DropDownAnswerDef;
    fillinQuestionAnswer?: string;
    //multiple choice question?
    //Dropdown question? 
    //Fill inn question?
}

export interface DropDownAnswerDef{
    alternativeId: string;
}