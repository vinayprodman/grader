import { Calculator, FlaskConical, Library } from 'lucide-react';
import { Subject, Chapter, Quiz } from '../types/education';
import { notify } from './notifications';

// Helper function to get subject metadata
export const getSubjectInfo = (subjectId: string, grade: string): Subject => {
  const subjects = {
    math: {
      id: 'math',
      title: 'Mathematics',
      description: 'Master mathematical concepts and problem-solving skills',
      icon: <Calculator size={24} />,
      color: '#E0F2FE',
      grade
    },
    science: {
      id: 'science',
      title: 'Science',
      description: 'Explore scientific concepts and natural phenomena',
      icon: <FlaskConical size={24} />,
      color: '#D1FAE5',
      grade
    },
    english: {
      id: 'english',
      title: 'English',
      description: 'Develop language skills and literary understanding',
      icon: <Library size={24} />,
      color: '#FEF3C7',
      grade
    }
  };
  
  return subjects[subjectId as keyof typeof subjects];
};

export const getChapterDetails = async (grade: string, subject: string, chapterId: string): Promise<Chapter | null> => {
  try {
    const numericGrade = grade.startsWith('grade') ? grade.replace('grade', '') : grade;
    const modules = import.meta.glob('../data/grades/grade*/*/chapter*/chapters.json');
    const chapterFile = `/grade_${numericGrade}/${subject}/chapters.json`;

    const matchedModules = Object.entries(modules).filter(([path]) => path.includes(chapterFile));

    if (matchedModules.length === 0) {
      notify.error(`No chapter data found for grade ${grade} ${subject}`);
      return null;
    }

    const [, loader] = matchedModules[0];
    const module = await loader() as { chapters: Chapter[] };
    const chapter = module.chapters.find(c => c.id === chapterId);

    if (!chapter) {
      notify.error(`Chapter ${chapterId} not found`);
      return null;
    }

    return chapter;
  } catch (error) {
    notify.error('Failed to load chapter details');
    throw error;
  }
};

export const getQuiz = async (grade: string, subjectId: string, chapterId: string, quizId: string): Promise<Quiz | null> => {
  try {
    // Normalize parameters
    const normalizedGrade = normalizeId(grade, 'grade_');
    const normalizedChapterId = normalizeId(chapterId, 'chapter');
    const normalizedQuizId = quizId.startsWith('quiz') ? quizId : `quiz${quizId}`;
    
    // Construct quiz path pattern
    const quizPath = `grades/${normalizedGrade}/${subjectId}/${normalizedChapterId}/quizes/${normalizedQuizId}.json`;
    
    // Load all quiz modules
    const modules = import.meta.glob('../data/grades/*/*/chapter*/quizes/quiz*.json', { eager: true });
    
    // Find the matching quiz file
    const matchedModule = Object.entries(modules).find(([path]) => {
      const normalizedPath = normalizeFilePath(path);
      return normalizedPath.includes(quizPath);
    });
    
    if (!matchedModule) {
      console.error('Quiz not found:', { grade, subjectId, chapterId, quizId, quizPath });
      notify.error(`Quiz not found: ${quizId}`);
      return null;
    }

    return (matchedModule[1] as { default: Quiz }).default;
  } catch (error) {
    console.error('Error loading quiz:', error);
    notify.error('Failed to load quiz');
    throw error;
  }
};

export const getQuizzes = async (grade: string, subjectId: string, chapterId: string): Promise<Quiz[]> => {
  try {
    // Normalize parameters
    const normalizedGrade = normalizeId(grade, 'grade_');
    const normalizedChapterId = normalizeId(chapterId, 'chapter');
    
    // Construct quiz directory pattern
    const quizDirPattern = `grades/${normalizedGrade}/${subjectId}/${normalizedChapterId}/quizes`;
    
    // Load all quiz modules
    const quizModules = import.meta.glob('../data/grades/*/*/chapter*/quizes/quiz*.json', { eager: true });
    
    // Filter and map quizzes
    const filteredQuizzes = Object.entries(quizModules)
      .filter(([path]) => {
        const normalizedPath = normalizeFilePath(path);
        return normalizedPath.includes(quizDirPattern);
      })
      .map(([, module]) => (module as { default: Quiz }).default)
      .sort((a, b) => Number(a.id) - Number(b.id));

    if (filteredQuizzes.length === 0) {
      console.warn('No quizzes found:', { grade, subjectId, chapterId });
      notify.warning(`No quizzes found for chapter ${chapterId}`);
      return [];
    }

    // Remove duplicates
    return filteredQuizzes.filter((quiz, index, self) => 
      index === self.findIndex(q => q.id === quiz.id)
    );
  } catch (error) {
    console.error('Error loading quizzes:', error);
    notify.error('Failed to load quizzes');
    throw error;
  }
};

// Helper for path normalization
const normalizeId = (id: string, prefix: string): string => {
  return id.startsWith(prefix) ? id : `${prefix}${id}`;
};

// Helper for file path normalization
const normalizeFilePath = (path: string): string => {
  return path.replace(/\\/g, '/');
};

export const loadSubjectChapters = async (grade: string, subject: string): Promise<Chapter[]> => {
  try {
    const normalizedGrade = normalizeId(grade, 'grade_');
    const modules = import.meta.glob('../data/grades/*/*/chapters.json', { eager: true });
    const chapterFile = `../data/grades/${normalizedGrade}/${subject}/chapters.json`;

    const matchedModule = Object.entries(modules).find(([path]) => 
      normalizeFilePath(path).endsWith(normalizeFilePath(chapterFile))
    );

    if (!matchedModule) {
      notify.warning(`No chapters found for grade ${grade} ${subject}`);
      return [];
    }

    const [, module] = matchedModule;
    return (module as { default: { chapters: Chapter[] } }).default.chapters;
  } catch (error) {
    notify.error('Failed to load chapters');
    console.error('Error loading chapters:', error);
    throw error;
  }
};

export const loadChapter = async (grade: string, subject: string, chapterId: string): Promise<Chapter | null> => {
  try {
    const chapters = await loadSubjectChapters(grade, subject);
    const chapter = chapters.find(c => c.id.toString() === chapterId.toString());
    
    if (!chapter) {
      notify.warning(`Chapter ${chapterId} not found in ${subject} for grade ${grade}`);
      return null;
    }
    
    return chapter;
  } catch (error) {
    notify.error('Failed to load chapter');
    console.error('Error loading chapter:', error);
    throw error;
  }
};

export const loadChapterQuizzes = getQuizzes;
export const loadQuiz = getQuiz;