import { useState, useCallback } from 'react';
import { collection, query, where, getDocs, doc, getDoc, setDoc, updateDoc, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { notify } from '../utils/notifications';

import type { Subject as BaseSubject } from '../types/education';

export interface Subject extends Omit<BaseSubject, 'icon'> {
  icon?: string;
  chapters?: number;
  imageUrl?: string;
}

export interface Chapter {
  id: string;
  name: string;
  description: string;
  subjectId: string;
  order: number;
  locked: boolean;
  tests?: number;
}

export interface Test {
  id: string;
  name: string;
  description: string;
  chapterId: string;
  subjectId: string;
  duration: number; // in minutes
  totalQuestions: number;
  locked: boolean;
  questions?: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
}

export interface TestResult {
  id: string;
  testId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  completedAt: Date;
  timeSpent: number; // in seconds
  answers: {
    questionId: string;
    selectedOptionId: string;
    correct: boolean;
  }[];
}

const mockApiCall = async (data: any, delay = 500): Promise<any> => {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
};

export const useFirestore = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getSubjects = useCallback(async (grade: number): Promise<Subject[]> => {
    setLoading(true);
    setError(null);
    try {
      const subjects = [
        {
          id: 'math',
          title: 'Mathematics',
          description: 'Master mathematical concepts and problem-solving skills',
          grade: grade.toString(),
          color: '#E0F2FE',
          icon: '📘'
        },
        {
          id: 'science',
          title: 'Science',
          description: 'Explore scientific concepts and natural phenomena',
          grade: grade.toString(),
          color: '#D1FAE5',
          icon: '🔬'
        },
        {
          id: 'english',
          title: 'English',
          description: 'Develop language skills and literary understanding',
          grade: grade.toString(),
          color: '#FEF3C7',
          icon: '📖'
        }
      ];
      return await mockApiCall(subjects);
    } catch (err: any) {
      setError(err.message);
      notify.error('Failed to load subjects');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getChapters = useCallback(async (subjectId: string): Promise<Chapter[]> => {
    setLoading(true);
    setError(null);
    try {
      // Simulated API call - replace this with actual API endpoint when ready
      const chapters: Chapter[] = [
        {
          id: 'chapter1',
          name: 'Introduction',
          description: 'Basic concepts and fundamentals',
          subjectId,
          order: 1,
          locked: false,
          tests: 2
        },
        {
          id: 'chapter2',
          name: 'Advanced Topics',
          description: 'Complex problems and solutions',
          subjectId,
          order: 2,
          locked: true,
          tests: 3
        }
      ];
      return await mockApiCall(chapters);
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getTests = useCallback(async (chapterId: string): Promise<Test[]> => {
    setLoading(true);
    setError(null);
    try {
      // Simulated API call - replace this with actual API endpoint when ready
      const tests: Test[] = [
        {
          id: 'test1',
          name: 'Quiz 1',
          description: 'Basic concepts quiz',
          chapterId,
          subjectId: 'math',
          duration: 30,
          totalQuestions: 10,
          locked: false
        },
        {
          id: 'test2',
          name: 'Quiz 2',
          description: 'Advanced concepts quiz',
          chapterId,
          subjectId: 'math',
          duration: 45,
          totalQuestions: 15,
          locked: true
        }
      ];
      return await mockApiCall(tests);
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getQuestions = useCallback(async (testId: string): Promise<Question[]> => {
    setLoading(true);
    setError(null);
    try {
      // Simulated API call - replace this with actual API endpoint when ready
      const questions: Question[] = [
        {
          id: 'q1',
          text: 'What is 2 + 2?',
          options: [
            { id: 'a', text: '3' },
            { id: 'b', text: '4' },
            { id: 'c', text: '5' },
            { id: 'd', text: '6' }
          ],
          correctOptionId: 'b',
          explanation: '2 + 2 equals 4'
        },
        {
          id: 'q2',
          text: 'What is 5 x 5?',
          options: [
            { id: 'a', text: '20' },
            { id: 'b', text: '25' },
            { id: 'c', text: '30' },
            { id: 'd', text: '35' }
          ],
          correctOptionId: 'b',
          explanation: '5 x 5 equals 25'
        }
      ];
      return await mockApiCall(questions);
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const saveResult = useCallback(async (userId: string, result: TestResult): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      await setDoc(doc(db, 'users', userId, 'results', result.id), {
        ...result,
        completedAt: new Date()
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getResult = useCallback(async (userId: string, testId: string): Promise<TestResult | null> => {
    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, 'users', userId, 'results', testId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return docSnap.data() as TestResult;
      }
      
      return null;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getResultsForUser = useCallback(async (userId: string): Promise<TestResult[]> => {
    setLoading(true);
    setError(null);
    try {
      const q = query(
        collection(db, 'users', userId, 'results'),
        orderBy('completedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const results: TestResult[] = [];
      
      querySnapshot.forEach((doc) => {
        results.push({ id: doc.id, ...doc.data() } as TestResult);
      });
      
      return results;
    } catch (err: any) {
      setError(err.message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getSubjects,
    getChapters,
    getTests,
    getQuestions,
    saveResult,
    getResult,
    getResultsForUser
  };
};
