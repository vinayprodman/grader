import { useState, useEffect } from 'react';
import { useAuth } from '../components/context/AuthContext';
import { progressService } from '../services/progressService';
import type { PerformanceData, PerformanceMetrics } from '../types/performance';

export const usePerformance = () => {
  const { user } = useAuth();
  const [performance, setPerformance] = useState<PerformanceData | null>(null);
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadPerformance = async () => {
      if (!user) {
        setPerformance(null);
        setMetrics(null);
        setLoading(false);
        return;
      }
      
      try {
        const progress = await progressService.getUserProgress(user.uid);
        if (!mounted) return;
        
        setPerformance(progress);
        if (progress) {
          setMetrics(progressService.calculateProgress(progress));
        }
      } catch (err) {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load performance data');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadPerformance();
    return () => {
      mounted = false;
    };
  }, [user]);

  useEffect(() => {
    if (user) {
      progressService.startSession(user.uid);
      return () => {
        progressService.endSession(user.uid);
      };
    }
  }, [user]);

  const getOverallProgress = () => {
    if (!metrics) return 0;
    return metrics.overallProgress || 0;
  };

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const updateTimeSpent = async (timeSpent: number): Promise<void> => {
    if (!user || !performance) return;
    try {
      await progressService.updateTimeSpent(user.uid, timeSpent);
      const progress = await progressService.getUserProgress(user.uid);
      if (progress) {
        setPerformance(progress);
        setMetrics(progressService.calculateProgress(progress));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update time spent');
    }
  };

  const updateScores = async (quizScore: number): Promise<void> => {
    if (!user || !performance) return;
    try {
      await progressService.updateScores(user.uid, quizScore);
      const progress = await progressService.getUserProgress(user.uid);
      if (progress) {
        setPerformance(progress);
        setMetrics(progressService.calculateProgress(progress));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update scores');
    }
  };

  const updateQuizCompletion = async (quizId: string, score: number, time: number): Promise<void> => {
    if (!user || !performance) return;
    try {
      await progressService.updateCompletedQuizzes(user.uid, quizId, score, time);
      const progress = await progressService.getUserProgress(user.uid);
      if (progress) {
        setPerformance(progress);
        setMetrics(progressService.calculateProgress(progress));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update quiz completion');
    }
  };

  const addTestResult = async (testResult: { testId: string; score: number; timeSpent: number; subjectId: string }): Promise<void> => {
    if (!user) {
      throw new Error('User must be authenticated to add test results');
    }
    try {
      await progressService.addTestResult(user.uid, testResult);
      const progress = await progressService.getUserProgress(user.uid);
      if (progress) {
        setPerformance(progress);
        setMetrics(progressService.calculateProgress(progress));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add test result');
    }
  };

  return {
    performance,
    metrics,
    loading,
    error,
    formatTime,
    updateTimeSpent,
    updateScores,
    updateQuizCompletion,
    getOverallProgress,
    addTestResult
  };
};
