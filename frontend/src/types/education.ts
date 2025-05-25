export interface Subject {
  id: string;
  title: string;
  description: string;
  grade: string;
  color: string;
  icon: React.ReactNode;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  isLocked: boolean;
}

export interface QuizResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  completedAt?: string;
  date?: string;
  strengths?: string[];
  weaknesses?: string[];
} 