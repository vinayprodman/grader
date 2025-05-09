export interface Subject {
  id: string;
  name: string;
  description: string;
  icon: string;
  grade: number;
}

export interface Chapter {
  id: string;
  subjectId: string;
  title: string;
  description: string;
  order: number;
  quizzes: string[];
}

export interface QuizQuestion {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  answer_key: number; // 0 for A, 1 for B, 2 for C, 3 for D
}

export interface Quiz {
  id: string;
  chapterId: string;
  title: string;
  description: string;
  subject: string;
  grade: number;
  questions: QuizQuestion[];
} 