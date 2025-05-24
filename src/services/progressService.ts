import { auth, db } from '../lib/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { notify } from '../utils/notifications';
import type { PerformanceData, PerformanceMetrics } from '../types/performance';

// Map to track session start times
const sessionStarts = new Map<string, Date>();

const getWeekStartDate = (): string => {
  const now = new Date();
  const day = now.getDay(); // 0-6, where 0 is Sunday
  const diff = now.getDate() - day;
  const weekStart = new Date(now.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);
  return weekStart.toISOString();
};

class ProgressService {
  async getUserProgress(userId: string): Promise<PerformanceData | null> {
    try {
      if (!auth.currentUser) {
        notify.error('Authentication required to fetch progress');
        return null;
      }

      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        notify.warning('User profile not found');
        return null;
      }

      const userData = userDoc.data();
      return {
        overallScore: userData.overallScore || 0,
        averageScore: userData.averageScore || 0,
        quizCount: userData.quizCount || 0,
        totalTimeSpent: userData.totalTimeSpent || 0,
        weeklyTimeSpent: userData.weeklyTimeSpent || {},
        completedQuizzes: userData.completedQuizzes || {},
        lastActive: userData.lastActive || new Date().toISOString()
      };
    } catch (error) {
      notify.error('Failed to fetch user progress');
      throw error;
    }
  }

  async startSession(userId: string): Promise<void> {
    try {
      if (!auth.currentUser) {
        notify.error('Authentication required to start session');
        return;
      }

      const userRef = doc(db, 'users', userId);
      sessionStarts.set(userId, new Date());
      
      await updateDoc(userRef, {
        lastActive: new Date().toISOString(),
        lastLogin: serverTimestamp()
      });
    } catch (error) {
      notify.error('Failed to start user session');
    }
  }

  async endSession(userId: string): Promise<void> {
    try {
      if (!auth.currentUser) {
        notify.error('Authentication required to end session');
        return;
      }

      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        notify.warning('User profile not found');
        return;
      }

      const sessionStart = sessionStarts.get(userId);
      if (!sessionStart) return;

      const sessionEnd = new Date();
      const sessionDuration = Math.floor((sessionEnd.getTime() - sessionStart.getTime()) / 1000); // in seconds
      
      const userData = userDoc.data();
      const weekStart = getWeekStartDate();
      const currentTimeSpent = userData.weeklyTimeSpent?.[weekStart] || 0;
      const newTimeSpent = currentTimeSpent + sessionDuration;
      
      await updateDoc(userRef, {
        lastActive: new Date().toISOString(),
        totalTimeSpent: (userData.totalTimeSpent || 0) + sessionDuration,
        [`weeklyTimeSpent.${weekStart}`]: newTimeSpent
      });
      
      sessionStarts.delete(userId);
    } catch (error) {
      notify.error('Failed to update session time');
    }
  }

  async updateScores(userId: string, quizScore: number): Promise<void> {
    try {
      if (!auth.currentUser) {
        notify.error('Authentication required to update scores');
        return;
      }

      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        notify.warning('User profile not found');
        return;
      }

      const userData = userDoc.data();
      const currentQuizCount = userData.quizCount || 0;
      const currentOverallScore = userData.overallScore || 0;
      
      const newQuizCount = currentQuizCount + 1;
      const newOverallScore = currentOverallScore + quizScore;
      const newAverageScore = Math.round(newOverallScore / newQuizCount);

      await updateDoc(userRef, {
        overallScore: newOverallScore,
        averageScore: newAverageScore,
        quizCount: newQuizCount
      });
    } catch (error) {
      notify.error('Failed to update quiz scores');
      throw error;
    }
  }

  async updateTimeSpent(userId: string, timeSpent: number): Promise<void> {
    try {
      if (!auth.currentUser) {
        notify.error('Authentication required to update time spent');
        return;
      }

      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        notify.warning('User profile not found');
        return;
      }

      const userData = userDoc.data();
      const weekStart = getWeekStartDate();
      const currentWeeklyTime = userData.weeklyTimeSpent?.[weekStart] || 0;

      await updateDoc(userRef, {
        totalTimeSpent: (userData.totalTimeSpent || 0) + timeSpent,
        [`weeklyTimeSpent.${weekStart}`]: currentWeeklyTime + timeSpent,
        lastActive: new Date().toISOString()
      });
    } catch (error) {
      notify.error('Failed to update time spent');
      throw error;
    }
  }

  async updateCompletedQuizzes(userId: string, quizId: string, score: number, time: number): Promise<void> {
    try {
      if (!auth.currentUser) {
        notify.error('Authentication required to update quiz completion');
        return;
      }

      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        [`completedQuizzes.${quizId}`]: {
          completedAt: new Date().toISOString(),
          score,
          time
        }
      });
    } catch (error) {
      notify.error('Failed to update quiz completion status');
      throw error;
    }
  }

  async addTestResult(userId: string, testResult: { testId: string; score: number; timeSpent: number; subjectId: string }): Promise<void> {
    try {
      if (!auth.currentUser) {
        notify.error('Authentication required to update progress');
        return;
      }

      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        notify.warning('User profile not found');
        return;
      }

      const userData = userDoc.data();
      const totalQuizzes = (userData.quizCount || 0) + 1;
      const totalScore = (userData.overallScore || 0) * (totalQuizzes - 1) + testResult.score;
      const weekStart = getWeekStartDate();
        await updateDoc(userRef, {
        overallScore: Math.min(100, Number((totalScore / totalQuizzes).toFixed(2))),
        averageScore: Math.min(100, Number((totalScore / totalQuizzes).toFixed(2))),
        quizCount: totalQuizzes,
        totalTimeSpent: (userData.totalTimeSpent || 0) + testResult.timeSpent,
        [`weeklyTimeSpent.${weekStart}`]: (userData.weeklyTimeSpent?.[weekStart] || 0) + testResult.timeSpent,
        [`completedQuizzes.${testResult.testId}`]: {
          score: testResult.score,
          timeSpent: testResult.timeSpent,
          completedAt: serverTimestamp(),
          subjectId: testResult.subjectId
        },
        lastActive: serverTimestamp()
      });

      notify.success('Progress updated successfully');
    } catch (error) {
      notify.error('Failed to update progress');
      throw error;
    }
  }

  calculateProgress(userProgress: PerformanceData): PerformanceMetrics {
    const overallProgress = userProgress.quizCount > 0 
      ? Math.round((userProgress.overallScore / (userProgress.quizCount * 100)) * 100)
      : 0;

    const weeklyProgress = this.calculateWeeklyProgress(userProgress.weeklyTimeSpent);
    const quizCompletionRate = this.calculateCompletionRate(userProgress);
    const [strengthAreas, weakAreas] = this.analyzePerformance(userProgress);
    
    return {
      overallProgress,
      timeSpent: userProgress.totalTimeSpent || 0,
      averageScore: userProgress.averageScore || 0,
      weeklyProgress,
      quizCompletionRate,
      strengthAreas,
      weakAreas
    };
  }

  private calculateWeeklyProgress(weeklyTimeSpent: Record<string, number>): number {
    const currentWeek = getWeekStartDate();
    return weeklyTimeSpent[currentWeek] || 0;
  }

  private calculateCompletionRate(userProgress: PerformanceData): number {
    const totalQuizzes = Object.keys(userProgress.completedQuizzes).length;
    return totalQuizzes > 0 ? (totalQuizzes / userProgress.quizCount) * 100 : 0;
  }

  private analyzePerformance(userProgress: PerformanceData): [string[], string[]] {
    const quizzes = Object.entries(userProgress.completedQuizzes);
    const strengthAreas: string[] = [];
    const weakAreas: string[] = [];

    if (quizzes.length === 0) {
      return [[], []];
    }

    // Group quizzes by subject/topic and calculate average scores
    const topicScores = quizzes.reduce((acc, [quizId, data]) => {
      const topic = quizId.split('-')[0]; // Assuming quizId format: "topic-quiz"
      if (!acc[topic]) {
        acc[topic] = { total: 0, count: 0 };
      }
      acc[topic].total += data.score;
      acc[topic].count += 1;
      return acc;
    }, {} as Record<string, { total: number; count: number }>);

    // Analyze performance by topic
    Object.entries(topicScores).forEach(([topic, data]) => {
      const avgScore = data.total / data.count;
      if (avgScore >= 80) {
        strengthAreas.push(topic);
      } else if (avgScore < 60) {
        weakAreas.push(topic);
      }
    });

    return [strengthAreas, weakAreas];
  }
}

export const progressService = new ProgressService();