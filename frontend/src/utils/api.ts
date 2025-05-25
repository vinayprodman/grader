import grade5Data from '../data/grade5.json';
import { Grade5Data, SubjectData, ChapterData, TestData, QuestionData } from '../types/grade5Data';
import { Subject, Chapter } from '../types/education';
import { Quiz } from '../docs/quiz-config';

const simulateApiCall = async <T>(data: T, delay = 500): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
};

export const api = {
  // Subjects
  getSubjects: async (grade: number): Promise<Subject[]> => {
    const subjectsData: SubjectData[] = [
      {
        id: 'math',
        name: 'Mathematics',
        description: 'Master mathematical concepts and problem-solving skills',
        imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904',
        grade,
        color: '#E0F2FE',
        icon: '📘',
        chapters: 4
      },
      {
        id: 'science',
        name: 'Science',
        description: 'Explore scientific concepts and natural phenomena',
        imageUrl: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d',
        grade,
        color: '#D1FAE5',
        icon: '🔬',
        chapters: 4
      },
      {
        id: 'english',
        name: 'English',
        description: 'Develop language skills and literary understanding',
        imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8',
        grade,
        color: '#FEF3C7',
        icon: '📖',
        chapters: 4
      },
      {
        id: 'history',
        name: 'History',
        description: 'World history, civilizations, and geography',
        imageUrl: 'https://images.unsplash.com/photo-1447069387593-a5de0862481e',
        grade,
        color: '#FEF3C7',
        icon: '🏛️',
        chapters: 4
      }
    ];
    
    const subjects: Subject[] = subjectsData.map(item => ({
      id: item.id,
      title: item.name,
      description: item.description,
      grade: String(item.grade),
      color: item.color,
      icon: item.icon,
    }));

    return simulateApiCall(subjects);
  },

  // Chapters
  getChapters: async (subjectId: string): Promise<Chapter[]> => {
    const chaptersData = (grade5Data as Grade5Data).chapters[subjectId] || [];
    
    // Transform ChapterData to Chapter type
    const chapters: Chapter[] = chaptersData.map(item => ({
      id: item.id,
      title: item.name, // Map name to title
      description: item.description,
      isLocked: item.locked, // Map locked to isLocked
    }));

    return simulateApiCall(chapters);
  },

  // Tests
  getTests: async (chapterId: string): Promise<Quiz[]> => {
    const testsData = (grade5Data as Grade5Data).tests[chapterId] || [];

    // Transform TestData to Quiz type
    const tests: Quiz[] = testsData.map(item => {
      // Find the corresponding subject to get the grade
      const subject = (grade5Data as Grade5Data).subjects.find(s => s.id === item.subjectId);
      const grade = subject ? String(subject.grade) : 'unknown'; // Get grade and convert to string, default to 'unknown' if subject not found

      return {
        id: item.id,
        title: item.name, // Map name to title
        description: item.description,
        questions: item.questions ? item.questions.map(q => ({
          id: q.id,
          question: q.text, // Map text to question
          options: q.options.map(opt => opt.text), // Map options array to array of strings
          correctIndex: q.options.findIndex(opt => opt.id === q.correctOptionId), // Find index of correct option
          explanation: q.explanation,
        })) : [],
        timeLimit: item.duration, // Map duration to timeLimit
        difficulty: 'medium', // Assuming a default difficulty
        isLocked: item.locked, // Map locked to isLocked
        requiredScore: 0, // Assuming a default requiredScore
        chapterId: item.chapterId,
        subjectId: item.subjectId,
        grade: grade,
      };
    });

    return simulateApiCall(tests);
  },

  // Questions
  getQuestions: async (testId: string) => {
    const allTests = Object.values((grade5Data as Grade5Data).tests).flat();
    const test = allTests.find(t => t.id === testId);
    return simulateApiCall(test?.questions || []);
  }
};
