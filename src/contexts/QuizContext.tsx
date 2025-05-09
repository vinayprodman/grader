import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { api } from '../services/api';
import { Quiz, QuizQuestion, Chapter, Subject } from '../types/education';

// Types
export interface QuizQuestion {
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  answer_key: number; // 0 for A, 1 for B, 2 for C, 3 for D
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  subject: string;
  grade: number;
  questions: QuizQuestion[];
}

export interface QuizResult {
  quizId: string;
  score: number;
  accuracy: number;
  time: number;
  date: Date;
  correctAnswers: number;
  totalQuestions: number;
}

interface QuizContextType {
  currentQuiz: Quiz | null;
  setCurrentQuiz: (quiz: Quiz | null) => void;
  currentChapter: Chapter | null;
  setCurrentChapter: (chapter: Chapter | null) => void;
  currentSubject: Subject | null;
  setCurrentSubject: (subject: Subject | null) => void;
  quizResults: QuizResult[];
  addQuizResult: (result: QuizResult) => void;
  getQuizResults: () => QuizResult[];
  getQuizResult: (quizId: string) => QuizResult | null;
  getAverageScore: () => number;
  getTotalQuizzesTaken: () => number;
  getTotalCorrectAnswers: () => number;
  getTotalQuestions: () => number;
  getTotalTimeSpent: () => number;
  loading: boolean;
  error: string | null;
}

// Create context
const QuizContext = createContext<QuizContextType | undefined>(undefined);

// Quiz provider component
export const QuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [currentSubject, setCurrentSubject] = useState<Subject | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { quizId, chapterId, subjectId } = useParams<{ quizId: string; chapterId: string; subjectId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const getQuizResult = (quizId: string): QuizResult | null => {
    return quizResults.find(result => result.quizId === quizId) || null;
  };

  const addQuizResult = (result: QuizResult) => {
    setQuizResults(prev => [...prev, result]);
  };

  const getQuizResults = () => {
    return quizResults;
  };

  const getAverageScore = () => {
    if (quizResults.length === 0) return 0;
    const totalScore = quizResults.reduce((sum, result) => sum + result.score, 0);
    return totalScore / quizResults.length;
  };

  const getTotalQuizzesTaken = () => {
    return quizResults.length;
  };

  const getTotalCorrectAnswers = () => {
    return quizResults.reduce((sum, result) => sum + result.correctAnswers, 0);
  };

  const getTotalQuestions = () => {
    return quizResults.reduce((sum, result) => sum + result.totalQuestions, 0);
  };

  const getTotalTimeSpent = () => {
    return quizResults.reduce((sum, result) => sum + result.time, 0);
  };

  const value = {
    currentQuiz,
    setCurrentQuiz,
    currentChapter,
    setCurrentChapter,
    currentSubject,
    setCurrentSubject,
    quizResults,
    getQuizResults,
    getQuizResult,
    addQuizResult,
    getAverageScore,
    getTotalQuizzesTaken,
    getTotalCorrectAnswers,
    getTotalQuestions,
    getTotalTimeSpent,
    loading,
    error
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
};

// Custom hook for using quiz context
export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};