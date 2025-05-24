import React, { createContext, useContext, useState, useEffect } from 'react';
import { Chapter, Quiz } from '../types/education';
import { api } from '../services/api';
import { useAuth } from './AuthContext';
import { notify } from '../utils/notifications';

interface SubjectContextType {
  chapters: Chapter[];
  currentChapter: Chapter | null;
  currentQuizzes: Quiz[];
  setCurrentChapter: (chapter: Chapter | null) => void;
  unlockChapter: (chapterId: string) => void;
  unlockQuiz: (chapterId: string, quizId: string) => void;
  getNextQuiz: (currentQuizId: string) => Quiz | null;
}

const SubjectContext = createContext<SubjectContextType | undefined>(undefined);

export const useSubject = () => {
  const context = useContext(SubjectContext);
  if (!context) {
    throw new Error('useSubject must be used within a SubjectProvider');
  }
  return context;
};

export const SubjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [currentQuizzes, setCurrentQuizzes] = useState<Quiz[]>([]);
  const { user } = useAuth();

  // Load user progress from localStorage when component mounts
  useEffect(() => {
    if (user) {
      try {
        const savedProgress = localStorage.getItem(`quizProgress_${user.uid}`);
        if (savedProgress) {
          const parsedProgress = JSON.parse(savedProgress);
          if (Array.isArray(parsedProgress)) {
            setChapters(parsedProgress);
          }
        }
      } catch (error) {
        console.error('Error loading progress:', error);
        notify.error('Failed to load your progress');
      }
    }
  }, [user]);

  // Load quizzes when current chapter changes
  useEffect(() => {
    if (currentChapter && user) {
      const loadQuizzes = async () => {
        try {
          const quizzes = await api.getChapterQuizzes('6', 'science', currentChapter.id);
          setCurrentQuizzes(quizzes);
        } catch (error) {
          console.error('Error loading quizzes:', error);
          notify.error('Failed to load quizzes');
        }
      };

      loadQuizzes();
    }
  }, [currentChapter, user]);

  const unlockChapter = (chapterId: string) => {
    setChapters(prevChapters => {
      const newChapters = prevChapters.map(chapter => 
        chapter.id.toString() === chapterId ? { ...chapter, isLocked: false } : chapter
      );
      
      if (user) {
        localStorage.setItem(`quizProgress_${user.uid}`, JSON.stringify(newChapters));
      }
      
      return newChapters;
    });
  };

  const unlockQuiz = (chapterId: string, quizId: string) => {
    setCurrentQuizzes(prevQuizzes => {
      const newQuizzes = prevQuizzes.map(quiz =>
        quiz.id.toString() === quizId ? { ...quiz, isLocked: false } : quiz
      );

      if (user) {
        const key = `quizProgress_${user.uid}_${chapterId}`;
        localStorage.setItem(key, JSON.stringify(newQuizzes));
      }

      return newQuizzes;
    });
  };

  const getNextQuiz = (currentQuizId: string): Quiz | null => {
    const currentIndex = currentQuizzes.findIndex(quiz => quiz.id === currentQuizId);
    return currentIndex < currentQuizzes.length - 1 ? currentQuizzes[currentIndex + 1] : null;
  };

  const value = {
    chapters,
    currentChapter,
    currentQuizzes,
    setCurrentChapter,
    unlockChapter,
    unlockQuiz,
    getNextQuiz,
  };

  return <SubjectContext.Provider value={value}>{children}</SubjectContext.Provider>;
};