import React, { createContext, useContext, useState, useEffect } from 'react';
import { Chapter, Quiz, scienceChapters } from '../data/subjectData';
import { useAuth } from './AuthContext';

interface SubjectContextType {
  chapters: Chapter[];
  currentChapter: Chapter | null;
  setCurrentChapter: (chapter: Chapter) => void;
  unlockChapter: (chapterId: string) => void;
  unlockQuiz: (chapterId: string, quizId: string) => void;
  getNextQuiz: (currentQuizId: string) => Quiz | null;
}

const SubjectContext = createContext<SubjectContextType>({} as SubjectContextType);

export const useSubject = () => useContext(SubjectContext);

export const SubjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chapters, setChapters] = useState<Chapter[]>(scienceChapters);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Load user progress from localStorage or database
    if (user) {
      const savedProgress = localStorage.getItem(`quizProgress_${user.id}`);
      if (savedProgress) {
        setChapters(JSON.parse(savedProgress));
      }
    }
  }, [user]);

  const unlockChapter = (chapterId: string) => {
    setChapters(prevChapters => {
      const newChapters = prevChapters.map(chapter => {
        if (chapter.id === chapterId) {
          return { ...chapter, isLocked: false };
        }
        return chapter;
      });
      
      if (user) {
        localStorage.setItem(`quizProgress_${user.id}`, JSON.stringify(newChapters));
      }
      return newChapters;
    });
  };

  const unlockQuiz = (chapterId: string, quizId: string) => {
    setChapters(prevChapters => {
      const newChapters = prevChapters.map(chapter => {
        if (chapter.id === chapterId) {
          const updatedQuizzes = chapter.quizzes.map(quiz => {
            if (quiz.id === quizId) {
              return { ...quiz, isLocked: false };
            }
            return quiz;
          });
          return { ...chapter, quizzes: updatedQuizzes };
        }
        return chapter;
      });
      
      if (user) {
        localStorage.setItem(`quizProgress_${user.id}`, JSON.stringify(newChapters));
      }
      return newChapters;
    });
  };

  const getNextQuiz = (currentQuizId: string): Quiz | null => {
    if (!currentChapter) return null;
    
    const currentQuizIndex = currentChapter.quizzes.findIndex(q => q.id === currentQuizId);
    if (currentQuizIndex === -1 || currentQuizIndex === currentChapter.quizzes.length - 1) {
      return null;
    }
    
    return currentChapter.quizzes[currentQuizIndex + 1];
  };

  return (
    <SubjectContext.Provider value={{
      chapters,
      currentChapter,
      setCurrentChapter,
      unlockChapter,
      unlockQuiz,
      getNextQuiz
    }}>
      {children}
    </SubjectContext.Provider>
  );
};