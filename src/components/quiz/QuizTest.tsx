import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useQuiz } from '../../contexts/QuizContext';
import { api } from '../../services/api';
import { progressService } from '../../services/progressService';
import { Quiz } from '../../types/education';
import '../../styles/QuizTest.css';
import Loading from '../common/Loading';
import { ChevronRight, Clock } from 'lucide-react';

interface TestData {
  answers: string[];
  questionTimes: number[];
  navigationHistory: Array<{
    from: number;
    to: number;
    action: 'next' | 'prev';
  }>;
}

const QuizTest: React.FC = () => {
  const { grade, subjectId, chapterId, quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addQuizResult } = useQuiz();
  
  console.log('QuizTest: Component mounted with quizId:', quizId);
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [testStartTime, setTestStartTime] = useState<number | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);
  const [testData, setTestData] = useState<TestData>({
    answers: [],
    questionTimes: [],
    navigationHistory: []
  });
  const [loading, setLoading] = useState(true);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const timerStartRef = useRef<number | null>(null);
  const [timerDisplay, setTimerDisplay] = useState('00:00');

  // Load saved quiz state
  useEffect(() => {
    if (quizId && user) {
      const savedState = localStorage.getItem(`quiz_${quizId}_${user.uid}`);
      if (savedState) {
        const { currentQuestion: savedQuestion, testData: savedTestData } = JSON.parse(savedState);
        setCurrentQuestion(savedQuestion);
        setTestData(savedTestData);
      }
    }
  }, [quizId, user]);

  // Save quiz state
  useEffect(() => {
    if (quizId && user && !isQuizComplete) {
      localStorage.setItem(`quiz_${quizId}_${user.uid}`, JSON.stringify({
        currentQuestion,
        testData
      }));
    }
  }, [currentQuestion, testData, quizId, user, isQuizComplete]);

  // Navigation protection
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!isQuizComplete) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isQuizComplete]);

  useEffect(() => {
    const loadQuiz = async () => {
      console.log('QuizTest: Starting to load quiz data');
      console.log('QuizTest: quizId from params:', quizId);
      
      try {
        if (!grade || !subjectId || !chapterId || !quizId) {
          console.log('QuizTest: Missing params, redirecting to dashboard', { grade, subjectId, chapterId, quizId });
          navigate('/dashboard');
          return;
        }

        console.log('QuizTest: Fetching quiz data for', { grade, subjectId, chapterId, quizId });
        const quizData = await api.getQuiz(grade, subjectId, chapterId, quizId);
        console.log('QuizTest: Received quiz data:', quizData);

        if (quizData) {
          setQuiz(quizData);
          setTestData(prev => ({
            ...prev,
            answers: new Array(quizData.questions.length).fill('')
          }));
          console.log('QuizTest: Quiz data set successfully');
        } else {
          console.log('QuizTest: No quiz data found');
          setLoading(false);
          showNotification('Quiz not found. Please try another quiz.');
          setTimeout(() => navigate('/dashboard'), 1500);
        }
      } catch (error) {
        console.error('QuizTest: Error loading quiz:', error);
        setLoading(false);
        showNotification('Error loading quiz. Please try again.');
        setTimeout(() => navigate('/dashboard'), 1500);
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [quizId, navigate]);

  // Prevent going back to quiz after completion
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (isQuizComplete) {
        e.preventDefault();
        if (subjectId && chapterId) {
          navigate(`/chapter/${grade}/${subjectId}/${chapterId}`);
        } else {
          navigate('/dashboard');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate, isQuizComplete, subjectId, chapterId, grade]);

  useEffect(() => {
    if (quiz && !testStartTime) {
      console.log('QuizTest: Starting test for quiz:', quiz.id);
      const now = Date.now();
      setTestStartTime(now);
      timerStartRef.current = now;
      setQuestionStartTime(now);
    }
  }, [quiz]);

  // Timer effect
  useEffect(() => {
    if (!quiz) return;
    const interval = setInterval(() => {
      const start = timerStartRef.current;
      if (start) {
        const elapsed = Math.floor((Date.now() - start) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        setTimerDisplay(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [quiz]);

  const selectAnswer = (option: string) => {
    setTestData(prev => ({
      ...prev,
      answers: prev.answers.map((answer, index) => 
        index === currentQuestion ? option : answer
      )
    }));
  };

  const nextQuestion = () => {
    if (!testData.answers[currentQuestion]) {
      showNotification('Please select an answer before proceeding.');
      return;
    }

    if (questionStartTime) {
      const timeSpent = Date.now() - questionStartTime;
    setTestData(prev => ({
      ...prev,
        questionTimes: prev.questionTimes.map((time, index) => 
          index === currentQuestion ? timeSpent : time
        ),
      navigationHistory: [
        ...prev.navigationHistory,
        { from: currentQuestion, to: currentQuestion + 1, action: 'next' }
      ]
    }));
    }

    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestion(prev => prev + 1);
    setQuestionStartTime(Date.now());
    } else {
      handleSubmit();
    }
  };

  const prevQuestion = () => {
    if (questionStartTime) {
      const timeSpent = Date.now() - questionStartTime;
    setTestData(prev => ({
      ...prev,
        questionTimes: prev.questionTimes.map((time, index) => 
          index === currentQuestion ? timeSpent : time
        ),
      navigationHistory: [
        ...prev.navigationHistory,
        { from: currentQuestion, to: currentQuestion - 1, action: 'prev' }
      ]
    }));
    }

    setCurrentQuestion(prev => prev - 1);
    setQuestionStartTime(Date.now());
  };

  const handleSubmit = async () => {
    if (!quiz || !testStartTime) return;

    const correctAnswers = Object.values(testData.answers).filter(
      (answer, index) => answer === String(quiz.questions[index].correctIndex)
    ).length;

    const totalQuestions = quiz.questions.length;
    const score = (correctAnswers / totalQuestions) * 100;
    const accuracy = (correctAnswers / totalQuestions) * 100;
    const time = Date.now() - testStartTime;

    const result = {
      quizId: quiz.id,
      score,
      accuracy,
      time,
      date: new Date(),
      correctAnswers,
      totalQuestions
    };

    setIsQuizComplete(true);
    localStorage.removeItem(`quiz_${quizId}_${user?.uid}`);
    addQuizResult(result);

    // Update Firebase with quiz result
    if (user?.uid) {
      await progressService.updateScores(user.uid, score);
      await progressService.updateCompletedQuizzes(user.uid, quiz.id, score, time);
    }
    // Redirect to performance summary with score and time
    navigate('/performance', { state: { score, time } });
  };

  const showNotification = (message: string) => {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      background-color: var(--gray-800);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-lg);
      z-index: 1000;
      animation: slideUp 0.3s ease;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.style.animation = 'fadeOut 0.3s ease';
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 1500);
  };

  if (loading) {
    return <Loading text="Loading quiz..." fullScreen />;
  }

  if (!quiz) {
    return <Loading text="Quiz not found..." fullScreen />;
  }

  console.log('QuizTest: Rendering quiz:', { quiz, currentQuestion });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        
        {/* Header for Title and Timer */}
        <div className="quiz-header">
          {/* Quiz Title */}
          <div className="quiz-title-header">
            {quiz?.title}
          </div>

          {/* Timer Section */}
          <div className="timer-header">
             <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 shadow-2xl">
              <Clock className={`w-5 h-5 text-white`} />
              </div>
            <div className={`text-lg font-bold text-white`}>
              {timerDisplay}
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${((currentQuestion + 1) / (quiz?.questions.length || 1)) * 100}%` }}
          />
        </div>
        
        {/* Question Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
          <div className="mb-6">
            {/* Progress Indicator */}
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold rounded-full mb-4">
              Question {currentQuestion + 1} of {quiz?.questions.length}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 leading-relaxed">
              {quiz?.questions[currentQuestion]?.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-4">
            {quiz?.questions[currentQuestion]?.options && Object.entries(quiz.questions[currentQuestion].options).map(([key, value]) => {
              const isSelected = testData.answers[currentQuestion] === key;
              
              let optionClass = "group relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-lg ";
              
              if (isSelected) {
                optionClass += "border-purple-500 bg-purple-50 shadow-purple-200/50 shadow-lg";
              } else {
                optionClass += "border-gray-200 bg-white hover:border-purple-300 hover:bg-purple-50";
              }

              return (
                <div
                  key={key}
                  className={optionClass}
                  onClick={() => selectAnswer(key)}
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                      isSelected
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-100 text-gray-600 group-hover:bg-purple-100 group-hover:text-purple-600'
                    }`}>
                      {key}
                    </div>
                    <span className="text-lg font-medium text-gray-800">
                      {value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="text-center">
           {/* Previous Button */}
           <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className={`inline-flex items-center px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform mr-4 ${
              currentQuestion === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-2xl hover:scale-105 hover:shadow-blue-500/25'
            }`}
            style={{ visibility: currentQuestion === 0 ? 'hidden' : 'visible' }}
          >
            Previous
          </button>

          {/* Next Button */}
          <button
            onClick={nextQuestion}
            disabled={!testData.answers[currentQuestion]}
            className={`inline-flex items-center px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform ${
              testData.answers[currentQuestion]
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl hover:scale-105 hover:shadow-purple-500/25'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {currentQuestion === (quiz?.questions.length || 0) - 1 ? 'Finish Quiz' : 'Next Question'}
            <ChevronRight className="ml-2 w-5 h-5" />
          </button>
        </div>

        {/* Global Progress Indicator */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-2">
            {quiz?.questions.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  i <= currentQuestion ? 'bg-purple-500' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTest; 