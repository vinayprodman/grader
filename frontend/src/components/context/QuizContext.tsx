import { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../docs/auth-config';
import { 
  Quiz, 
  QuizResult, 
  TestData, 
  QUIZ_STORAGE_PREFIX,
  QUIZ_CONFIG 
} from '../../docs/quiz-config';
import { calculateProgress } from '../../docs/performance-config';
import { useAuth } from './AuthContext';

interface QuizContextType {
  currentQuiz: Quiz | null;
  testData: TestData | null;
  quizResult: QuizResult | null;
  loading: boolean;
  startQuiz: (quiz: Quiz) => void;
  saveAnswer: (questionId: string, answer: string) => void;
  submitQuiz: () => Promise<void>;
  loadQuizState: (quizId: string) => void;
  clearQuizState: () => void;
}

const QuizContext = createContext<QuizContextType | null>(null);

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};

export const QuizProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, userData, updateUserData } = useAuth();
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [testData, setTestData] = useState<TestData | null>(null);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(false);

  const startQuiz = (quiz: Quiz) => {
    setCurrentQuiz(quiz);
    setTestData({
      answers: new Array(quiz.questions.length).fill(''),
      questionTimes: new Array(quiz.questions.length).fill(0),
      navigationHistory: []
    });
    setQuizResult(null);
  };

  const saveAnswer = (questionId: string, answer: string) => {
    if (!currentQuiz || !testData) return;

    const questionIndex = currentQuiz.questions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) return;

    const newAnswers = [...testData.answers];
    newAnswers[questionIndex] = answer;

    setTestData({
      ...testData,
      answers: newAnswers,
      navigationHistory: [
        ...testData.navigationHistory,
        { questionId: questionIndex, timestamp: Date.now() }
      ]
    });

    // Auto-save to localStorage
    if (user) {
      localStorage.setItem(
        `${QUIZ_STORAGE_PREFIX}${currentQuiz.id}_${user.uid}`,
        JSON.stringify({
          answers: newAnswers,
          questionTimes: testData.questionTimes,
          navigationHistory: testData.navigationHistory
        })
      );
    }
  };

  const submitQuiz = async () => {
    if (!currentQuiz || !testData || !user || !userData) return;

    setLoading(true);
    try {
      // Calculate results
      const correctAnswers = currentQuiz.questions.reduce((count, question, index) => {
        return count + (testData.answers[index] === question.options[question.correctIndex] ? 1 : 0);
      }, 0);

      const totalQuestions = currentQuiz.questions.length;
      const score = Math.round((correctAnswers / totalQuestions) * 100);
      const time = testData.questionTimes.reduce((sum, time) => sum + time, 0);

      const result: QuizResult = {
        quizId: currentQuiz.id,
        score,
        accuracy: (correctAnswers / totalQuestions) * 100,
        time,
        date: new Date(),
        correctAnswers,
        totalQuestions,
        completedAt: new Date().toISOString()
      };

      // Update user progress
      const newUserData = {
        ...userData,
        quizCount: userData.quizCount + 1,
        overallScore: userData.overallScore + score,
        averageScore: (userData.averageScore * userData.quizCount + score) / (userData.quizCount + 1),
        completedQuizzes: {
          ...userData.completedQuizzes,
          [currentQuiz.id]: {
            score,
            completedAt: new Date().toISOString()
          }
        }
      };

      // Save to Firestore
      await updateUserData(newUserData);

      // Clear quiz state
      localStorage.removeItem(`${QUIZ_STORAGE_PREFIX}${currentQuiz.id}_${user.uid}`);
      setQuizResult(result);
      setCurrentQuiz(null);
      setTestData(null);
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadQuizState = (quizId: string) => {
    if (!user) return;

    const savedState = localStorage.getItem(`${QUIZ_STORAGE_PREFIX}${quizId}_${user.uid}`);
    if (savedState) {
      setTestData(JSON.parse(savedState));
    }
  };

  const clearQuizState = () => {
    if (!user || !currentQuiz) return;

    localStorage.removeItem(`${QUIZ_STORAGE_PREFIX}${currentQuiz.id}_${user.uid}`);
    setCurrentQuiz(null);
    setTestData(null);
    setQuizResult(null);
  };

  const value = {
    currentQuiz,
    testData,
    quizResult,
    loading,
    startQuiz,
    saveAnswer,
    submitQuiz,
    loadQuizState,
    clearQuizState
  };

  return (
    <QuizContext.Provider value={value}>
      {children}
    </QuizContext.Provider>
  );
}; 