import { useState, useCallback } from 'react';
import { api } from '../utils/api';
import type { Quiz } from '../docs/quiz-config';
import type { Question } from '../hooks/useFirestore';

export const useQuizzes = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTests = useCallback(async (chapterId: string): Promise<Quiz[]> => {
    setLoading(true);
    try {
      const tests = await api.getTests(chapterId);
      return tests;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load tests');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getQuestions = useCallback(async (testId: string): Promise<Question[]> => {
    setLoading(true);
    try {
      const questions = await api.getQuestions(testId);
      return questions;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load questions');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getTests,
    getQuestions
  };
};
