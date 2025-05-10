import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { quizData } from '../data/quizData';

// Types
export interface QuizQuestion {
  id: number;
  question: string;
  options: Record<string, string>;
  answer_key: number;
  explanation_correct: string;
  explanation_wrong: string;
  icon_correct: string;
  icon_wrong: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  level: number;
  category: string;
  questions: QuizQuestion[];
  duration: number;
  price: string;
  icon: string;
}

export interface QuizResult {
  quizId: string;
  score: number;
  totalQuestions: number;
  completedAt: string;
  strengths: string[];
  weaknesses: string[];
}

interface QuizContextType {
  currentQuestion: number;
  setCurrentQuestion: React.Dispatch<React.SetStateAction<number>>;
  correctAnswers: number;
  setCorrectAnswers: React.Dispatch<React.SetStateAction<number>>;
  showAnimation: boolean;
  setShowAnimation: React.Dispatch<React.SetStateAction<boolean>>;
  animationData: {
    emoji: string;
    explanation: string;
  };
  setAnimationData: React.Dispatch<React.SetStateAction<{
    emoji: string;
    explanation: string;
  }>>;
  selectOption: (optionIndex: number, isCorrect: boolean, questionData: QuizQuestion) => void;
  currentQuiz: Quiz | null;
  loading: boolean;
  quizResults: QuizResult[];
  saveQuizResult: (result: QuizResult) => void;
  totalQuestions: number;
}

// Create context
const QuizContext = createContext<QuizContextType>({} as QuizContextType);

// Quiz provider component
export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const [animationData, setAnimationData] = useState({ emoji: '🎯', explanation: '' });
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const totalQuestions = 10; // Fixed for this demo
  
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (quizId) {
      // Find the quiz by ID
      const quiz = quizData.find(q => q.id === quizId);
      if (quiz) {
        setCurrentQuiz(quiz);
      }
    }
    setLoading(false);
    
    // Load quiz results from localStorage
    const savedResults = localStorage.getItem('quizResults');
    if (savedResults) {
      setQuizResults(JSON.parse(savedResults));
    }
  }, [quizId]);

  const selectOption = (optionIndex: number, isCorrect: boolean, questionData: QuizQuestion) => {
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
      setAnimationData({
        emoji: questionData.icon_correct,
        explanation: questionData.explanation_correct
      });
    } else {
      setAnimationData({
        emoji: questionData.icon_wrong,
        explanation: questionData.explanation_wrong
      });
    }
    
    setShowAnimation(true);
    
    setTimeout(() => {
      setShowAnimation(false);
      
      if (currentQuestion === totalQuestions) {
        // Navigate to completion screen after last question
        navigate(`/quiz/${quizId}/completion`);
        return;
      }
      
      // Move to next question
      setCurrentQuestion(prev => prev + 1);
      
      // Show popup at halfway point
      if (currentQuestion === 5) {
        // Implementation for popup would go here
      }
    }, 3000);
  };

  const saveQuizResult = (result: QuizResult) => {
    const updatedResults = [...quizResults, result];
    setQuizResults(updatedResults);
    localStorage.setItem('quizResults', JSON.stringify(updatedResults));
  };

  return (
    <QuizContext.Provider 
      value={{ 
        currentQuestion,
        setCurrentQuestion,
        correctAnswers,
        setCorrectAnswers,
        showAnimation,
        setShowAnimation,
        animationData,
        setAnimationData,
        selectOption,
        currentQuiz,
        loading,
        quizResults,
        saveQuizResult,
        totalQuestions
      }}
    >
      {!loading && children}
    </QuizContext.Provider>
  );
};

// Custom hook for using quiz context
export const useQuiz = () => useContext(QuizContext);