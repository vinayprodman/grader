import React, { createContext, useContext, useState, useEffect } from 'react';
import { Chapter, Quiz } from '../types/education';
import { useAuth } from './AuthContext';
import { api } from '../services/api';

interface SubjectContextType {
  chapters: Chapter[];
  currentChapter: Chapter | null;
  currentQuizzes: Quiz[];
  setCurrentChapter: (chapter: Chapter | null) => void;
  unlockChapter: (chapterId: string) => void;
  unlockQuiz: (chapterId: string, quizId: string) => void;
  getNextQuiz: (currentQuizId: string) => Quiz | null;
}

const SubjectContext = createContext<SubjectContextType>({} as SubjectContextType);

export const useSubject = () => useContext(SubjectContext);

export const SubjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [currentQuizzes, setCurrentQuizzes] = useState<Quiz[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Load user progress from localStorage or database
    if (user) {
      const savedProgress = localStorage.getItem(`quizProgress_${user.uid}`);
      if (savedProgress) {
        setChapters(JSON.parse(savedProgress));
      }
    }
  }, [user]);

  useEffect(() => {
    // Load quizzes when current chapter changes
    if (currentChapter && user) {
      api.getChapterQuizzes('6', 'science', currentChapter.id.toString())
        .then(quizzes => setCurrentQuizzes(quizzes))
        .catch(error => console.error('Error loading quizzes:', error));
    }
  }, [currentChapter, user]);

  const unlockChapter = (chapterId: string) => {
    setChapters(prevChapters => {
      const newChapters = prevChapters.map(chapter => {
        if (chapter.id.toString() === chapterId) {
          return { ...chapter, isLocked: false };
        }
        return chapter;
      });
      
      if (user) {
        localStorage.setItem(`quizProgress_${user.uid}`, JSON.stringify(newChapters));
      }
      return newChapters;
    });
  };

  const unlockQuiz = (chapterId: string, quizId: string) => {
    setCurrentQuizzes(prevQuizzes => {
      const newQuizzes = prevQuizzes.map(quiz => {
        if (quiz.id.toString() === quizId) {
          return { ...quiz, isLocked: false };
        }
        return quiz;
      });
      
      if (user) {
        localStorage.setItem(`quizProgress_${user.uid}`, JSON.stringify(newQuizzes));
      }
      return newQuizzes;
    });
  };

  const getNextQuiz = (currentQuizId: string): Quiz | null => {
    if (!currentQuizzes.length) return null;
    
    const currentIndex = currentQuizzes.findIndex(quiz => quiz.id.toString() === currentQuizId);
    if (currentIndex === -1 || currentIndex === currentQuizzes.length - 1) return null;
    
    return currentQuizzes[currentIndex + 1];
  };

  return (
    <SubjectContext.Provider value={{
      chapters,
      currentChapter,
      currentQuizzes,
      setCurrentChapter,
      unlockChapter,
      unlockQuiz,
      getNextQuiz
    }}>
      {children}
    </SubjectContext.Provider>
  );
};