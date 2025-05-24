import grade5Data from '../data/grade5.json';

const simulateApiCall = async <T>(data: T, delay = 500): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
};

export const api = {
  // Subjects
  getSubjects: async (grade: number) => {
    const subjects = [
      {
        id: 'math',
        name: 'Mathematics',
        description: 'Master mathematical concepts and problem-solving skills',
        grade,
        color: '#E0F2FE',
        icon: '📘',
        chapters: 4
      },
      {
        id: 'science',
        name: 'Science',
        description: 'Explore scientific concepts and natural phenomena',
        grade,
        color: '#D1FAE5',
        icon: '🔬',
        chapters: 4
      },
      {
        id: 'english',
        name: 'English',
        description: 'Develop language skills and literary understanding',
        grade,
        color: '#FEF3C7',
        icon: '📖',
        chapters: 4
      }
    ];
    return simulateApiCall(subjects);
  },

  // Chapters
  getChapters: async (subjectId: string) => {
    const chapters = grade5Data.chapters[subjectId] || [];
    return simulateApiCall(chapters);
  },

  // Tests
  getTests: async (chapterId: string) => {
    const tests = grade5Data.tests[chapterId] || [];
    return simulateApiCall(tests);
  },

  // Questions
  getQuestions: async (testId: string) => {
    const allTests = Object.values(grade5Data.tests).flat();
    const test = allTests.find(t => t.id === testId);
    return simulateApiCall(test?.questions || []);
  }
};
