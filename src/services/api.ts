import { Subject, Chapter, Quiz } from '../types/education';
import { getSubjectInfo, loadSubjectChapters, loadChapter, loadChapterQuizzes, loadQuiz } from '../utils/dataLoader';
import { notify } from '../utils/notifications';

// Helper function to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // Get all subjects for a grade
  async getSubjects(grade: string): Promise<Subject[]> {
    await delay(500); // Simulate network delay
    const subjectIds = ['math', 'science', 'english'];
    return subjectIds.map(subjectId => getSubjectInfo(subjectId, grade));
  },

  // Get a specific subject
  async getSubject(grade: string, subjectId: string): Promise<Subject> {
    await delay(300);
    return getSubjectInfo(subjectId, grade);
  },

  // Get all chapters for a subject
  async getChapters(grade: string, subjectId: string): Promise<Chapter[]> {
    await delay(500);
    return loadSubjectChapters(grade, subjectId);
  },

  // Get a specific chapter
  async getChapter(grade: string, subjectId: string, chapterId: string): Promise<Chapter> {
    await delay(300);
    const chapter = await loadChapter(grade, subjectId, chapterId);
    if (!chapter) {
      throw new Error(`Chapter ${chapterId} not found`);
    }
    return chapter;
  },

  // Get all quizzes for a chapter
  async getChapterQuizzes(grade: string, subjectId: string, chapterId: string): Promise<Quiz[]> {
    await delay(500);
    return loadChapterQuizzes(grade, subjectId, chapterId);
  },

  // Get a specific quiz for a chapter
  async getQuiz(grade: string, subjectId: string, chapterId: string, quizId: string): Promise<Quiz> {
    await delay(300);
    const quiz = await loadQuiz(grade, subjectId, chapterId, quizId);
    if (!quiz) {
      throw new Error(`Quiz ${quizId} not found`);
    }
    return quiz;
  }
};