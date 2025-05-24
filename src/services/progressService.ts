import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { notify } from '../utils/notifications';

// Map to track session start times
const sessionStarts = new Map<string, Date>();

const getWeekStartDate = () => {
  const now = new Date();
  const day = now.getDay(); // 0-6, where 0 is Sunday
  const diff = now.getDate() - day;
  const weekStart = new Date(now.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);
  return weekStart.toISOString();
};

class ProgressService {
  async getUserProgress(userId: string) {
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
        ['weeklyTimeSpent.' + weekStart]: newTimeSpent
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

  calculateProgress(userProgress: any) {
    const overallProgress = userProgress.quizCount > 0 
      ? Math.round((userProgress.overallScore / (userProgress.quizCount * 100)) * 100)
      : 0;
    
    return {
      overallProgress,
      timeSpent: userProgress.totalTimeSpent || 0,
      averageScore: userProgress.averageScore || 0
    };
  }
}

export const progressService = new ProgressService();