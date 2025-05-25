// Performance Tracking Configuration
export interface PerformanceMetrics {
  overallProgress: number;
  timeSpent: number;
  averageScore: number;
  weeklyProgress: number;
  quizCompletionRate: number;
  strengthAreas: string[];
  weakAreas: string[];
}

// Badge System Configuration
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

// Quiz Score Badges
export const SCORE_BADGES = {
  GOLD: {
    threshold: 80,
    badge: '🥇'
  },
  SILVER: {
    threshold: 60,
    badge: '🥈'
  },
  BRONZE: {
    threshold: 0,
    badge: '🥉'
  }
} as const;

// Performance Calculation Functions
export const calculateProgress = (userProgress: any): PerformanceMetrics => {
  const overallProgress = userProgress.quizCount > 0
    ? Math.round((userProgress.overallScore / (userProgress.quizCount * 100)) * 100)
    : 0;

  const weeklyProgress = calculateWeeklyProgress(userProgress.weeklyTimeSpent);
  const quizCompletionRate = calculateCompletionRate(userProgress);

  return {
    overallProgress,
    timeSpent: userProgress.totalTimeSpent || 0,
    averageScore: userProgress.averageScore || 0,
    weeklyProgress,
    quizCompletionRate,
    strengthAreas: identifyStrengths(userProgress),
    weakAreas: identifyWeaknesses(userProgress)
  };
};

// Helper Functions
const calculateWeeklyProgress = (weeklyTimeSpent: Record<string, number>): number => {
  const currentWeek = new Date().toISOString().slice(0, 10);
  return weeklyTimeSpent[currentWeek] || 0;
};

const calculateCompletionRate = (userProgress: any): number => {
  const totalQuizzes = Object.keys(userProgress.completedQuizzes).length;
  return totalQuizzes > 0 ? (totalQuizzes / userProgress.quizCount) * 100 : 0;
};

const identifyStrengths = (userProgress: any): string[] => {
  // Implementation for identifying strong areas based on quiz performance
  return [];
};

const identifyWeaknesses = (userProgress: any): string[] => {
  // Implementation for identifying weak areas based on quiz performance
  return [];
}; 