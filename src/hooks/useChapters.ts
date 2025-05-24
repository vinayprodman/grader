import { useState, useCallback } from 'react';
import { api } from '../utils/api';
import type { Chapter } from '../types/education';

export const useChapters = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getChapters = useCallback(async (subjectId: string): Promise<Chapter[]> => {
    setLoading(true);
    try {
      const chapters = await api.getChapters(subjectId);
      return chapters;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load chapters');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    getChapters
  };
};
