import { DropDownAnswerDef } from "@/types/answer";
import { DropDownQuestionDef } from "@/types/question";
import { Button, Dropdown } from "@navikt/ds-react";
import { useState } from "react";

interface Props {
    question: DropDownQuestionDef;
    onAnswer: (answer: DropDownAnswerDef) => void;
}

export default function DropDownModelView({ question, onAnswer }: Props) {

    const [effect, setEffect] = useState(false);

    return (
        <section>
            <Dropdown>
                <Button as={Dropdown.Toggle}>DropDown</Button>
                <Dropdown.Menu>
                    <Dropdown.Menu.GroupedList>
                        {question.alternatives.map((alternative) => (
                            <Dropdown.Menu.GroupedList.Item 
                                onClick={() => onAnswer({ alternativeId: alternative.id })} 
                                onAnimationEnd={() => setEffect(false)} 
                                className={`${effect && "animate-wiggle"} block w-full h-20 mx-auto mb-6 px-4 py-2 font-semibold text-sm bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-700 hover:shadow-xl`}
                            >
                                {alternative.alternativeText}
                            </Dropdown.Menu.GroupedList.Item>
                        ))}
                    </Dropdown.Menu.GroupedList>
                </Dropdown.Menu>
            </Dropdown>
        </section>
    );
}