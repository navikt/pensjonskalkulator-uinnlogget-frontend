import { Question } from "@/types/question";

export const mockQuestions: Array<Question> = [
    {
        id: 1,
        title: "Født",
        description: "Her fyller du inn bla bla bla....",
        questionText: 'Hva er din alder?',
        dropdownQuestion: {
          alternatives: [
            {
                id: '1',
                alternativeText: '64år',
            },
            {
                id: '2',
                alternativeText: '65år',
            },
            {
                id: '3',
                alternativeText: '66år',
            },
            {
                id: '4',
                alternativeText: '67år',
            },
          ],
        },
      },
];