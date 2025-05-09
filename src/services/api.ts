import { Subject, Chapter, Quiz } from '../types/education';

// Mock data
const subjects: Subject[] = [
  {
    id: 'math',
    name: 'Mathematics',
    description: 'Learn fundamental mathematical concepts and problem-solving skills.',
    icon: '🧮',
    grade: 5
  },
  {
    id: 'science',
    name: 'Science',
    description: 'Explore the wonders of the natural world through scientific inquiry.',
    icon: '🔬',
    grade: 5
  },
  {
    id: 'english',
    name: 'English',
    description: 'Develop language skills through reading, writing, and communication.',
    icon: '📚',
    grade: 5
  }
];

const chapters: Chapter[] = [
  {
    id: 'decimals',
    subjectId: 'math',
    title: 'Decimals',
    description: 'Learn about decimal numbers and their operations.',
    order: 1,
    quizzes: ['decimals-1', 'decimals-2']
  },
  {
    id: 'fractions',
    subjectId: 'math',
    title: 'Fractions',
    description: 'Master the concepts of fractions and their applications.',
    order: 2,
    quizzes: ['fractions-1', 'fractions-2']
  },
  {
    id: 'matter',
    subjectId: 'science',
    title: 'States of Matter',
    description: 'Explore the different states of matter and their properties.',
    order: 1,
    quizzes: ['matter-1', 'matter-2']
  },
  {
    id: 'forces',
    subjectId: 'science',
    title: 'Forces and Motion',
    description: 'Understand the fundamental forces that govern motion.',
    order: 2,
    quizzes: ['forces-1', 'forces-2']
  },
  {
    id: 'grammar',
    subjectId: 'english',
    title: 'Grammar Basics',
    description: 'Learn essential grammar rules and sentence structure.',
    order: 1,
    quizzes: ['grammar-1', 'grammar-2']
  },
  {
    id: 'vocabulary',
    subjectId: 'english',
    title: 'Vocabulary Building',
    description: 'Expand your vocabulary through engaging exercises.',
    order: 2,
    quizzes: ['vocabulary-1', 'vocabulary-2']
  }
];

const quizzes: Quiz[] = [
  {
    id: 'decimals-1',
    chapterId: 'decimals',
    title: 'Decimals - Basic Operations',
    description: 'Test your understanding of basic decimal operations including addition, subtraction, multiplication, and division.',
    subject: 'Mathematics',
    grade: 5,
    questions: [
      {
        question: 'What is 0.5 + 0.3?',
        options: {
          A: '0.8',
          B: '0.7',
          C: '0.9',
          D: '0.6'
        },
        answer_key: 0
      },
      {
        question: 'What is 2.7 - 1.4?',
        options: {
          A: '1.1',
          B: '1.2',
          C: '1.3',
          D: '1.4'
        },
        answer_key: 2
      },
      {
        question: 'What is 0.6 × 0.5?',
        options: {
          A: '0.3',
          B: '0.25',
          C: '0.35',
          D: '0.4'
        },
        answer_key: 0
      }
    ]
  },
  {
    id: 'decimals-2',
    chapterId: 'decimals',
    title: 'Decimals - Advanced Operations',
    description: 'Practice more complex decimal operations and problem-solving.',
    subject: 'Mathematics',
    grade: 5,
    questions: [
      {
        question: 'What is 1.2 ÷ 0.4?',
        options: {
          A: '2.8',
          B: '3.0',
          C: '3.2',
          D: '3.4'
        },
        answer_key: 1
      },
      {
        question: 'Round 3.14159 to 2 decimal places.',
        options: {
          A: '3.14',
          B: '3.15',
          C: '3.16',
          D: '3.13'
        },
        answer_key: 0
      }
    ]
  },
  {
    id: 'fractions-1',
    chapterId: 'fractions',
    title: 'Fractions - Basic Concepts',
    description: 'Test your understanding of basic fraction concepts.',
    subject: 'Mathematics',
    grade: 5,
    questions: [
      {
        question: 'Which fraction is equivalent to 1/2?',
        options: {
          A: '2/4',
          B: '3/6',
          C: '4/8',
          D: 'All of the above'
        },
        answer_key: 3
      },
      {
        question: 'What is the simplified form of 6/9?',
        options: {
          A: '1/3',
          B: '2/3',
          C: '3/4',
          D: '4/5'
        },
        answer_key: 1
      }
    ]
  },
  {
    id: 'fractions-2',
    chapterId: 'fractions',
    title: 'Fractions - Operations',
    description: 'Practice fraction operations and problem-solving.',
    subject: 'Mathematics',
    grade: 5,
    questions: [
      {
        question: 'What is 1/4 + 1/4?',
        options: {
          A: '1/8',
          B: '1/2',
          C: '2/4',
          D: 'Both B and C'
        },
        answer_key: 3
      },
      {
        question: 'Which fraction represents 0.75?',
        options: {
          A: '1/4',
          B: '1/2',
          C: '3/4',
          D: '4/5'
        },
        answer_key: 2
      }
    ]
  }
];

// Simulated API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// API functions
export const api = {
  // Subjects
  getSubjects: async (): Promise<Subject[]> => {
    console.log('API: Getting all subjects');
    await delay(500);
    console.log('API: Returning subjects:', subjects);
    return subjects;
  },

  getSubject: async (id: string): Promise<Subject | undefined> => {
    console.log('API: Getting subject with ID:', id);
    await delay(300);
    const subject = subjects.find(s => s.id === id);
    console.log('API: Found subject:', subject);
    return subject;
  },

  // Chapters
  getChapters: async (subjectId?: string): Promise<Chapter[]> => {
    console.log('API: Getting chapters for subjectId:', subjectId);
    await delay(500);
    const filteredChapters = subjectId 
      ? chapters.filter(c => c.subjectId === subjectId)
      : chapters;
    console.log('API: Returning chapters:', filteredChapters);
    return filteredChapters;
  },

  getChapter: async (id: string): Promise<Chapter | undefined> => {
    console.log('API: Getting chapter with ID:', id);
    await delay(300);
    const chapter = chapters.find(c => c.id === id);
    console.log('API: Found chapter:', chapter);
    return chapter;
  },

  // Quizzes
  getQuizzes: async (chapterId?: string): Promise<Quiz[]> => {
    console.log('API: Getting quizzes for chapterId:', chapterId);
    await delay(500);
    const filteredQuizzes = chapterId 
      ? quizzes.filter(q => q.chapterId === chapterId)
      : quizzes;
    console.log('API: Returning quizzes:', filteredQuizzes);
    return filteredQuizzes;
  },

  getQuiz: async (id: string): Promise<Quiz | undefined> => {
    console.log('API: Getting quiz with ID:', id);
    await delay(300);
    const quiz = quizzes.find(q => q.id === id);
    console.log('API: Found quiz:', quiz);
    return quiz;
  }
}; 