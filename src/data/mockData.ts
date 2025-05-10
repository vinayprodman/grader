export interface Test {
  id: string;
  title: string;
  description: string;
  questions: number;
  timeLimit: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  isLocked: boolean;
  requiredScore?: number; // score required to unlock (if locked)
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: 'locked' | 'in-progress' | 'completed';
  tests: Test[];
  order: number;
}

export interface Subject {
  id: string;
  title: string;
  description: string;
  icon: string;
  chapters: Chapter[];
  grade: string;
}

export const mockSubjects: Subject[] = [
  {
    id: 'math-6',
    title: 'Mathematics',
    description: 'Master essential math concepts for grade 6',
    icon: '📐',
    grade: '6',
    chapters: [
      {
        id: 'fractions',
        title: 'Fractions',
        description: 'Learn about fractions, decimals, and percentages',
        icon: '🔢',
        status: 'completed',
        order: 1,
        tests: [
          {
            id: 'fractions-basic',
            title: 'Basic Fractions',
            description: 'Test your understanding of basic fraction concepts',
            questions: 10,
            timeLimit: 15,
            difficulty: 'easy',
            isLocked: false
          },
          {
            id: 'fractions-operations',
            title: 'Fraction Operations',
            description: 'Practice adding, subtracting, multiplying, and dividing fractions',
            questions: 15,
            timeLimit: 20,
            difficulty: 'medium',
            isLocked: false
          },
          {
            id: 'fractions-advanced',
            title: 'Advanced Fractions',
            description: 'Complex fraction problems and word problems',
            questions: 20,
            timeLimit: 25,
            difficulty: 'hard',
            isLocked: true,
            requiredScore: 80
          }
        ]
      },
      {
        id: 'decimals',
        title: 'Decimals',
        description: 'Understanding decimal numbers and operations',
        icon: '🔍',
        status: 'in-progress',
        order: 2,
        tests: [
          {
            id: 'decimals-basic',
            title: 'Decimal Basics',
            description: 'Introduction to decimal numbers',
            questions: 10,
            timeLimit: 15,
            difficulty: 'easy',
            isLocked: false
          },
          {
            id: 'decimals-operations',
            title: 'Decimal Operations',
            description: 'Adding, subtracting, multiplying, and dividing decimals',
            questions: 15,
            timeLimit: 20,
            difficulty: 'medium',
            isLocked: true,
            requiredScore: 70
          }
        ]
      },
      {
        id: 'algebra',
        title: 'Basic Algebra',
        description: 'Introduction to algebraic expressions and equations',
        icon: '📊',
        status: 'locked',
        order: 3,
        tests: [
          {
            id: 'algebra-expressions',
            title: 'Algebraic Expressions',
            description: 'Working with variables and expressions',
            questions: 15,
            timeLimit: 20,
            difficulty: 'medium',
            isLocked: true,
            requiredScore: 85
          }
        ]
      }
    ]
  },
  {
    id: 'science-6',
    title: 'Science',
    description: 'Explore scientific concepts for grade 6',
    icon: '🔬',
    grade: '6',
    chapters: [
      {
        id: 'ecosystems',
        title: 'Ecosystems',
        description: 'Learn about different ecosystems and their components',
        icon: '🌿',
        status: 'completed',
        order: 1,
        tests: [
          {
            id: 'ecosystems-basic',
            title: 'Ecosystem Basics',
            description: 'Understanding basic ecosystem concepts',
            questions: 10,
            timeLimit: 15,
            difficulty: 'easy',
            isLocked: false
          }
        ]
      },
      {
        id: 'energy',
        title: 'Energy',
        description: 'Different forms of energy and energy transformations',
        icon: '⚡',
        status: 'in-progress',
        order: 2,
        tests: [
          {
            id: 'energy-forms',
            title: 'Forms of Energy',
            description: 'Learn about different types of energy',
            questions: 12,
            timeLimit: 18,
            difficulty: 'medium',
            isLocked: false
          }
        ]
      }
    ]
  }
];

// Mock user progress data
export interface UserProgress {
  testId: string;
  score: number;
  completedAt: string;
  timeSpent: number; // in seconds
}

export const mockUserProgress: UserProgress[] = [
  {
    testId: 'fractions-basic',
    score: 85,
    completedAt: '2024-03-15T10:30:00Z',
    timeSpent: 720 // 12 minutes
  },
  {
    testId: 'fractions-operations',
    score: 75,
    completedAt: '2024-03-16T14:20:00Z',
    timeSpent: 900 // 15 minutes
  },
  {
    testId: 'ecosystems-basic',
    score: 90,
    completedAt: '2024-03-14T09:15:00Z',
    timeSpent: 600 // 10 minutes
  }
];

// Helper functions to simulate API calls
export const getSubjects = () => Promise.resolve(mockSubjects);
export const getSubject = (id: string) => Promise.resolve(mockSubjects.find(s => s.id === id));
export const getChapter = (subjectId: string, chapterId: string) => {
  const subject = mockSubjects.find(s => s.id === subjectId);
  return Promise.resolve(subject?.chapters.find(c => c.id === chapterId));
};
export const getTest = (subjectId: string, chapterId: string, testId: string) => {
  const subject = mockSubjects.find(s => s.id === subjectId);
  const chapter = subject?.chapters.find(c => c.id === chapterId);
  return Promise.resolve(chapter?.tests.find(t => t.id === testId));
};
export const getUserProgress = () => Promise.resolve(mockUserProgress); 