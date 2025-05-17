import { db, auth } from '../firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { UserProgress } from '../types/education';

const getWeekStartDate = (date: Date = new Date()): string => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay()); // Set to Sunday
  return d.toISOString().split('T')[0];
};

// Store session start times in memory
const sessionStarts = new Map<string, Date>();

export const progressService = {
  async getUserProgress(userId: string): Promise<UserProgress | null> {
    try {
      if (!auth.currentUser) {
        console.error('No authenticated user found');
        return null;
      }

      console.log('Getting user progress for:', userId);
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        console.error('User document not found');
        return null;
      }

      const userData = userDoc.data();
      const progress: UserProgress = {
        userId,
        grade: userData.profile?.grade || '',
        completedQuizzes: userData.completedQuizzes || {},
        weeklyTimeSpent: userData.weeklyTimeSpent || {},
        lastActive: userData.lastActive || new Date().toISOString(),
        overallScore: userData.overallScore || 0,
        averageScore: userData.averageScore || 0,
        totalTimeSpent: userData.totalTimeSpent || 0,
        quizCount: userData.quizCount || 0
      };

      console.log('Retrieved user progress:', progress);
      return progress;
    } catch (error) {
      console.error('Error getting user progress:', error);
      return null;
    }
  },

  async startSession(userId: string): Promise<void> {
    try {
      if (!auth.currentUser) {
        console.error('No authenticated user found');
        return;
      }

      console.log('Starting session for user:', userId);
      const userRef = doc(db, 'users', userId);
      sessionStarts.set(userId, new Date());
      
      await updateDoc(userRef, {
        lastActive: new Date().toISOString(),
        lastLogin: serverTimestamp()
      });
      console.log('Session started successfully');
    } catch (error) {
      console.error('Error starting session:', error);
    }
  },

  async endSession(userId: string): Promise<void> {
    try {
      if (!auth.currentUser) {
        console.error('No authenticated user found');
        return;
      }

      console.log('Ending session for user:', userId);
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        console.log('User document not found');
        return;
      }

      const sessionStart = sessionStarts.get(userId);
      if (!sessionStart) {
        console.log('No active session to end');
        return;
      }

      const sessionEnd = new Date();
      const sessionDuration = Math.floor((sessionEnd.getTime() - sessionStart.getTime()) / 1000); // in seconds
      
      console.log('Session duration:', sessionDuration, 'seconds');
      
      const userData = userDoc.data();
      const weekStart = getWeekStartDate();
      const currentTimeSpent = userData.weeklyTimeSpent?.[weekStart] || 0;
      const newTimeSpent = currentTimeSpent + sessionDuration;
      const totalTimeSpent = (userData.totalTimeSpent || 0) + sessionDuration;

      await updateDoc(userRef, {
        [`weeklyTimeSpent.${weekStart}`]: newTimeSpent,
        totalTimeSpent,
        lastActive: sessionEnd.toISOString()
      });
      
      sessionStarts.delete(userId);
      console.log('Session ended successfully. New time spent:', newTimeSpent);
    } catch (error) {
      console.error('Error ending session:', error);
    }
  },

  async updateTimeSpent(userId: string, timeSpent: number): Promise<void> {
    try {
      if (!auth.currentUser) {
        console.error('No authenticated user found');
        return;
      }

      console.log('Updating time spent for user:', userId, 'Time:', timeSpent);
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        console.error('User document not found');
        return;
      }

      const userData = userDoc.data();
      const weekStart = getWeekStartDate();
      const currentTimeSpent = userData.weeklyTimeSpent?.[weekStart] || 0;
      const newTimeSpent = currentTimeSpent + timeSpent;
      const totalTimeSpent = (userData.totalTimeSpent || 0) + timeSpent;

      await updateDoc(userRef, {
        [`weeklyTimeSpent.${weekStart}`]: newTimeSpent,
        totalTimeSpent,
        lastActive: new Date().toISOString()
      });
      console.log('Time spent updated successfully. New total:', newTimeSpent);
    } catch (error) {
      console.error('Error updating time spent:', error);
      throw error;
    }
  },

  async updateScores(userId: string, quizScore: number): Promise<void> {
    try {
      if (!auth.currentUser) {
        console.error('No authenticated user found');
        return;
      }

      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        console.error('User document not found');
        return;
      }

      const userData = userDoc.data();
      const currentOverallScore = userData.overallScore || 0;
      const quizCount = userData.quizCount || 0;

      const newQuizCount = quizCount + 1;
      const newOverallScore = currentOverallScore + quizScore;
      const newAverageScore = Math.round(newOverallScore / newQuizCount);

      await updateDoc(userRef, {
        overallScore: newOverallScore,
        averageScore: newAverageScore,
        quizCount: newQuizCount,
        lastActive: new Date().toISOString()
      });

      console.log('Scores updated successfully:', {
        overallScore: newOverallScore,
        averageScore: newAverageScore,
        quizCount: newQuizCount
      });
    } catch (error) {
      console.error('Error updating scores:', error);
      throw error;
    }
  },

  async updateCompletedQuizzes(userId: string, quizId: string, score: number, time: number): Promise<void> {
    try {
      if (!auth.currentUser) {
        console.error('No authenticated user found');
        return;
      }
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      if (!userDoc.exists()) {
        console.error('User document not found');
        return;
      }
      const userData = userDoc.data();
      const completedQuizzes = userData.completedQuizzes || {};
      completedQuizzes[quizId] = {
        score,
        time,
        completedAt: new Date().toISOString()
      };
      await updateDoc(userRef, {
        completedQuizzes,
        lastActive: new Date().toISOString()
      });
      console.log('Completed quizzes updated:', completedQuizzes);
    } catch (error) {
      console.error('Error updating completed quizzes:', error);
      throw error;
    }
  },

  calculateProgress(progress: UserProgress): {
    overallProgress: number;
    timeSpent: number;
    averageScore: number;
    quizCount: number;
  } {
    const weekStart = getWeekStartDate();
    const timeSpent = progress.weeklyTimeSpent[weekStart] || 0;

    // Calculate overall progress based on completed quizzes
    const totalQuizzes = progress.quizCount || 0;
    const totalQuizzesAvailable = 15; // 5 quizzes * 3 subjects
    const overallProgress = Math.round((totalQuizzes / totalQuizzesAvailable) * 100);

    return {
      overallProgress,
      timeSpent,
      averageScore: progress.averageScore || 0,
      quizCount: totalQuizzes
    };
  }
}; 