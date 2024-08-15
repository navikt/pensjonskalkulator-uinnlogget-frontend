import { useState } from "react";
import { Question } from "../types/question";
import { Answer } from "../types/answer";

interface Props{
    questions: Array<Question>;
}

export default function QuestionPage({ questions }: Props){

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Array<Answer>>([]);
    const [isFormFilled, setIsFormFilled] = useState(false);

    const currentQuestion = questions[currentQuestionIndex];

    function addAnswer(answer: Answer){
        setAnswers([...answers, answer]);

        if(currentQuestionIndex < questions.length - 1){
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else{
            setIsFormFilled(true);
        }
    }

    const isOnFirstQuestion = currentQuestionIndex === 0;
    const canGoBack = !isOnFirstQuestion;
    const isOnLastQuestion = currentQuestionIndex === questions.length -1;
    const hasAnsweredCurrentQuestion = answers[currentQuestionIndex];
    const canGoForward = hasAnsweredCurrentQuestion && !isOnLastQuestion;

    function handleGoBack() {
        if(canGoBack){
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    }

    function handleGoForward(){
        if(canGoForward){
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    }

    //function handleDropDownAnswer 

    //function handleFillInAnswer
    
    //function handleRadioAnswer

}

//Her er det antatt at Spørsmålene blir hentet fra et API. Se nærmere på dette