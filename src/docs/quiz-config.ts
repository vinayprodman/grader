// Quiz Data Structures
export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
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
  chapterId: string;
  subjectId: string;
  grade: string;
}

export interface QuizResult {
  quizId: string;
  score: number;
  accuracy: number;
  time: number;
  date: Date;
  correctAnswers: number;
  totalQuestions: number;
  strengths?: string[];
  weaknesses?: string[];
  completedAt?: string;
}

// Quiz State Management
export interface TestData {
  answers: string[];
  questionTimes: number[];
  navigationHistory: {
    questionId: number;
    timestamp: number;
  }[];
}

// Quiz Progress Tracking
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

// Quiz Storage Keys
export const QUIZ_STORAGE_PREFIX = 'quiz_';
export const QUIZ_STATE_KEY = (quizId: string, userId: string) => 
  `${QUIZ_STORAGE_PREFIX}${quizId}_${userId}`;

// Quiz Configuration
export const QUIZ_CONFIG = {
  MIN_PASS_SCORE: 60,
  MAX_ATTEMPTS: 3,
  TIME_WARNING_THRESHOLD: 0.2, // 20% of time remaining
  AUTO_SUBMIT: true,
  SHOW_RESULTS_IMMEDIATELY: true,
  ALLOW_REVIEW: true,
  REVIEW_TIME_LIMIT: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
} as const; 