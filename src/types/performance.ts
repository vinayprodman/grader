export interface PerformanceData {
  overallScore: number;
  averageScore: number;
  quizCount: number;
  totalTimeSpent: number;
  weeklyTimeSpent: Record<string, number>;
  completedQuizzes: Record<string, {
    completedAt: string;
    score: number;
    time: number;
  }>;
  lastActive: string;
}

export interface PerformanceMetrics {
  overallProgress: number;
  timeSpent: number;
  averageScore: number;
  weeklyProgress: number;
  quizCompletionRate: number;
  strengthAreas: string[];
  weakAreas: string[];
}

export interface Badge {
  threshold: number;
  badge: string;
  name: string;
}

export const BADGE_CONFIG = {
  PARTICIPATION: {
    threshold: 1,
    badge: '🎓',
    name: 'First Quiz'
  },
  DEDICATION: {
    threshold: 5,
    badge: '🚀',
    name: 'Dedicated Learner'
  },
  GOOD_PERFORMANCE: {
    threshold: 70,
    badge: '⭐',
    name: 'Good Performer'
  },
  EXCELLENT_PERFORMANCE: {
    threshold: 90,
    badge: '🏆',
    name: 'Excellent Performer'
  },
  PERFECT_SCORE: {
    threshold: 100,
    badge: '🥇',
    name: 'Perfect Score'
  }
} as const;