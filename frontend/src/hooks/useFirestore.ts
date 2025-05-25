import { useState, useCallback } from 'react';
import { collection, query, where, getDocs, doc, getDoc, setDoc, updateDoc, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { notify } from '../utils/notifications';
import axios from 'axios';

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
  question: string;
  options: { id: string; text: string }[];
  correctIndex: string;
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

// Utility type for unknown API data
// Used only for mock/testing, not production
const mockApiCall = async (data: unknown, delay = 500): Promise<unknown> => {
  return new Promise((resolve) => setTimeout(() => resolve(data), delay));
};

export const useFirestore = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch subjects from API
  const getSubjects = useCallback(async (grade: number): Promise<Subject[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://localhost:5000/${grade}/subjects`);
      return res.data.map((item: Record<string, unknown>) => ({
        id: item.id as string,
        title: item.name as string,
        description: item.description as string,
        grade: String(grade),
        color: (item.color as string) || "#E0F2FE",
        icon: (item.icon as string) || "📘",
      }));
    } catch (err) {
      setError((err as Error).message);
      notify.error('Failed to load subjects');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch chapters from API
  const getChapters = useCallback(async (subjectId: string, grade: number): Promise<Chapter[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://localhost:5000/${grade}/${subjectId}/chapters`);
      return res.data.map((item: Record<string, unknown>) => ({
        id: item.id as string,
        name: item.name as string,
        description: item.description as string,
        subjectId,
        order: (item.order as number) || 1,
        locked: (item.locked as boolean) || false,
        tests: (item.tests as number) || 0,
      }));
    } catch (err) {
      setError((err as Error).message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch quizzes (tests) from API
  const getTests = useCallback(async (grade: number, subjectId: string, chapterId: string): Promise<Test[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://localhost:5000/${grade}/${subjectId}/${chapterId}/quizzes`);
      return res.data.map((item: Record<string, unknown>) => ({
        id: item.id as string,
        name: item.name as string,
        description: item.description as string,
        chapterId,
        subjectId,
        duration: (item.duration as number) || 30,
        totalQuestions: (item.totalQuestions as number) || 0,
        locked: (item.locked as boolean) || false,
      }));
    } catch (err) {
      setError((err as Error).message);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch questions for a quiz from API
  const getQuestions = useCallback(async (grade: number, subjectId: string, chapterId: string, quizId: string): Promise<Question[]> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`http://localhost:5000/${grade}/${subjectId}/${chapterId}/${quizId}`);
      // Assuming res.data.questions is an array of questions
      if (!res.data.questions) return [];
      return res.data.questions.map((q: Record<string, unknown>) => ({
        id: q.id as string,
        question: q.question as string,
        options: q.options,
        correctIndex: q.correctIndex as string,
        explanation: q.explanation as string,
      }));
    } catch (err) {
      setError((err as Error).message);
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
    } catch (err) {
      setError((err as Error).message);
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
    } catch (err) {
      setError((err as Error).message);
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
    } catch (err) {
      setError((err as Error).message);
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
