export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Test {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
  isLocked: boolean;
  requiredScore?: number;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  isLocked?: boolean;
}

export interface Subject {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  grade: string;
  color?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  timeLimit: number;
  difficulty: 'easy' | 'medium' | 'hard';
  isLocked: boolean;
  requiredScore: number;
}

export interface UserProgress {
  userId: string;
  grade: string;
  completedQuizzes: {
    [quizId: string]: {
      score: number;
      completedAt: string;
    };
  };
  weeklyTimeSpent: {
    [weekStart: string]: number;
  };
  lastActive: string;
  overallScore: number;
  averageScore: number;
  totalTimeSpent: number;
  quizCount: number;
} 