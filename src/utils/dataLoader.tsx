import { BookOpen, Beaker, Book } from 'lucide-react';
import { Subject, Chapter, Quiz } from '../types/education';

// Helper function to get subject metadata
export const getSubjectInfo = (subjectId: string, grade: string): Subject => {
  const subjects = {
    math: {
      id: 'math',
      title: 'Mathematics',
      description: 'Master mathematical concepts and problem-solving skills',
      icon: <BookOpen size={24} />,
      grade
    },
    science: {
      id: 'science',
      title: 'Science',
      description: 'Explore scientific concepts and natural phenomena',
      icon: <Beaker size={24} />,
      grade
    },
    english: {
      id: 'english',
      title: 'English',
      description: 'Develop language skills and literary understanding',
      icon: <Book size={24} />,
      grade
    }
  };

  return subjects[subjectId as keyof typeof subjects];
};

// Helper function to load all chapters for a subject
export const loadSubjectChapters = async (grade: string, subjectId: string): Promise<Chapter[]> => {
  try {
    // Remove any non-numeric characters (like 'th Grade', 'st Grade', etc.) from grade
    const numericGrade = grade.replace(/\D/g, "");
    const module = await import(`../data/grades/grade_${numericGrade}/${subjectId}/chapters.json`);
    return module.chapters;
  } catch (error) {
    console.error('Error loading subject chapters:', error);
    return [];
  }
};

// Helper function to load a specific chapter
export const loadChapter = async (grade: string, subjectId: string, chapterId: string): Promise<Chapter> => {
  try {
    // Remove any non-numeric characters from grade
    const numericGrade = grade.replace(/\D/g, "");
    const module = await import(`../data/grades/grade_${numericGrade}/${subjectId}/chapters.json`);
    // Convert chapterId to number if it's in format "chapterX"
    const numericId = chapterId.startsWith('chapter') ? parseInt(chapterId.replace('chapter', '')) : parseInt(chapterId);
    
    if (isNaN(numericId)) {
      throw new Error(`Invalid chapter ID: ${chapterId}`);
    }

    const chapter = module.chapters.find((c: Chapter) => Number(c.id) === numericId);
    if (!chapter) {
      throw new Error(`Chapter ${chapterId} not found`);
    }
    return chapter;
  } catch (error) {
    console.error(`Error loading chapter ${chapterId} for ${subjectId}:`, error);
    throw error;
  }
};

// Helper function to load quizzes for a chapter
export const loadChapterQuizzes = async (grade: string, subjectId: string, chapterId: string): Promise<Quiz[]> => {
  try {
    // Remove any non-numeric characters from grade
    const numericGrade = grade.replace(/\D/g, "");
    const numericChapterId = chapterId.startsWith('chapter') ? chapterId.replace('chapter', '') : chapterId;
    // Use a static glob for all quiz files
    const quizModules = import.meta.glob('../data/grades/grade*/**/chapter*/quizes/quiz*.json');
    // Build the exact directory path for the current chapter
    const wantedDir = `/grade_${numericGrade}/${subjectId}/chapter${numericChapterId}/quizes/`;
    // Only match quiz files that are in the exact chapter directory
    const filteredQuizEntries = Object.entries(quizModules).filter(([path]) => {
      // Normalize path to use forward slashes
      const normalizedPath = path.replace(/\\/g, '/');
      // Ensure the path contains the wantedDir and is directly inside it (not a substring match)
      return normalizedPath.includes(wantedDir) &&
        new RegExp(`/grade_${numericGrade}/${subjectId}/chapter${numericChapterId}/quizes/quiz\\d+\\.json$`).test(normalizedPath);
    });
    // Debug log: show which files are being matched
    console.log('Matched quiz files for chapter', chapterId, ':', filteredQuizEntries.map(([path]) => path));
    const quizPromises: Promise<Quiz>[] = filteredQuizEntries
      .map(async ([, loader]) => {
        const module = await loader() as { default: Quiz };
        return module.default;
      });

    const quizzes = await Promise.all(quizPromises);
    quizzes.sort((a, b) => Number(a.id) - Number(b.id));
    // Remove accidental duplicates by id
    const uniqueQuizzes = quizzes.filter(
      (quiz, index, self) => self.findIndex(q => q.id === quiz.id) === index
    );
    console.log('Loaded quizzes:', uniqueQuizzes.map(q => ({ id: q.id, title: q.title })));
    if (uniqueQuizzes.length === 0) {
      console.warn(`No quizzes found for chapter ${chapterId} in ${subjectId}`);
    } else {
      console.log(`Loaded ${uniqueQuizzes.length} quizzes for chapter ${chapterId}`);
    }
    return uniqueQuizzes;
  } catch (error) {
    console.error('Error loading chapter quizzes:', error);
    throw new Error(`Failed to load quizzes for chapter ${chapterId}`);
  }
};

export const loadQuiz = async (grade: string, subjectId: string, chapterId: string, quizId: string): Promise<Quiz> => {
  try {
    // Remove any non-numeric characters from grade
    const numericGrade = grade.replace(/\D/g, "");
    const numericChapterId = chapterId.startsWith('chapter') ? chapterId.replace('chapter', '') : chapterId;
    const quizModules = import.meta.glob('../data/grades/grade*/**/chapter*/quizes/quiz*.json');
    const wantedPath = `/grade_${numericGrade}/${subjectId}/chapter${numericChapterId}/quizes/quiz${quizId}.json`;
    const entry = Object.entries(quizModules).find(([path]) => path.replace(/\\/g, '/').endsWith(wantedPath));
    if (!entry) {
      throw new Error(`Quiz file not found for ${wantedPath}`);
    }
    const [, loader] = entry;
    const module = await loader() as { default: Quiz };
    return module.default;
  } catch (error) {
    console.error('Error loading quiz:', error);
    throw new Error('Failed to load quiz');
  }
};