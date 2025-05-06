export interface Test {
  id: string;
  title: string;
  isLocked: boolean;
  requiredScore?: number;
  questions: number;
  timeLimit: number; // in minutes
}

export interface Chapter {
  id: string;
  title: string;
  icon: string;
  description: string;
  status: 'completed' | 'in-progress' | 'locked';
  tests: Test[];
  score?: number;
  timeSpent?: number;
  accuracy?: number;
}

export const chapterData: Chapter[] = [
  {
    id: 'fractions',
    title: 'Fractions',
    icon: '📊',
    description: 'Master the basics of fractions and their operations',
    status: 'completed',
    score: 85,
    timeSpent: 750, // in seconds
    accuracy: 90,
    tests: [
      {
        id: 'fractions-1',
        title: 'Basic Fractions',
        isLocked: false,
        questions: 10,
        timeLimit: 15
      },
      {
        id: 'fractions-2',
        title: 'Equivalent Fractions',
        isLocked: false,
        questions: 10,
        timeLimit: 15
      },
      {
        id: 'fractions-3',
        title: 'Adding Fractions',
        isLocked: false,
        questions: 10,
        timeLimit: 20
      },
      {
        id: 'fractions-4',
        title: 'Subtracting Fractions',
        isLocked: false,
        questions: 10,
        timeLimit: 20
      },
      {
        id: 'fractions-5',
        title: 'Mixed Numbers',
        isLocked: false,
        questions: 10,
        timeLimit: 25
      }
    ]
  },
  {
    id: 'decimals',
    title: 'Decimals',
    icon: '🔢',
    description: 'Learn decimal numbers and their operations',
    status: 'in-progress',
    tests: [
      {
        id: 'decimals-1',
        title: 'Introduction to Decimals',
        isLocked: false,
        questions: 10,
        timeLimit: 15
      },
      {
        id: 'decimals-2',
        title: 'Decimal Operations',
        isLocked: false,
        questions: 10,
        timeLimit: 20
      },
      {
        id: 'decimals-3',
        title: 'Decimal Word Problems',
        isLocked: false,
        questions: 10,
        timeLimit: 25
      },
      {
        id: 'decimals-4',
        title: 'Advanced Decimals',
        isLocked: true,
        requiredScore: 80,
        questions: 10,
        timeLimit: 30
      },
      {
        id: 'decimals-5',
        title: 'Decimal Applications',
        isLocked: true,
        requiredScore: 85,
        questions: 10,
        timeLimit: 30
      }
    ]
  }
]; 