import { useState, useCallback } from 'react';
import { api } from '../utils/api';
import type { Subject } from '../types/education';

export const useSubjects = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSubjects = useCallback(async (grade: number): Promise<Subject[]> => {
    setLoading(true);
    try {
      const subjects = await api.getSubjects(grade);
      return subjects;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load subjects');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getSubjects
  };
};
