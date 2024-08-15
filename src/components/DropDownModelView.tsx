import { DropDownAnswerDef } from "@/types/answer";
import { DropDownQuestionDef } from "@/types/question";
import { useState } from "react";

interface Props {
    question: DropDownQuestionDef;
    onAnswer: (answer: DropDownAnswerDef) => void;
}

export default function DropDownModelView({ question, onAnswer }: Props){

    const [effect, setEffect] = useState(false);

    return (
          <section>
            {question.alternatives.map((alternative) => (
              <button
                key={alternative.id}
                className={`${effect && "animate-wiggle"} block w-full h-20 mx-auto mb-6 px-4 py-2 font-semibold text-sm bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-700 hover:shadow-xl`}
                onClick={() => onAnswer({ alternativeId: alternative.id })}
                onAnimationEnd={() => setEffect(false)}
              >
                {alternative.alternativeText}
              </button>
            ))}
          </section>
    );
  }