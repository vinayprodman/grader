export interface Chapter {
  id: string;
  title: string;
  description: string;
  isLocked: boolean;
  quizzes: Quiz[];
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  level: number;
  isLocked: boolean;
  questions: Question[];
  requiredScore: number;
}

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const scienceChapters: Chapter[] = [
  {
    id: "light-shadows",
    title: "Light and Shadows",
    description: "Learn about sources of light, transparent and opaque objects, and how shadows form.",
    isLocked: false,
    quizzes: [
      {
        id: "light-basics",
        title: "Light Basics",
        description: "Test your knowledge about basic concepts of light",
        level: 1,
        isLocked: false,
        requiredScore: 70,
        questions: [
          {
            id: 1,
            question: "Which of the following is a natural source of light?",
            options: ["Bulb", "Tube light", "Sun", "Candle"],
            correctIndex: 2,
            explanation: "The Sun is a natural source of light that provides energy to Earth."
          },
          // Add more questions here
        ]
      },
      {
        id: "shadows-advanced",
        title: "Shadows Advanced",
        description: "Advanced concepts about shadow formation",
        level: 2,
        isLocked: true,
        requiredScore: 80,
        questions: []
      }
    ]
  },
  // Add more chapters
];