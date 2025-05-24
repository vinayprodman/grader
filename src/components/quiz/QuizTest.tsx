import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { progressService } from '../../services/progressService';
import Loading from '../common/Loading';
import { Quiz } from '../../types/education';
import { notify } from '../../utils/notifications';
import '../../styles/Quiz.css';

interface TestData {
  answers: string[];
  questionTimes: number[];
  navigationHistory: { questionId: number; timestamp: number }[];
}

const QuizTest: React.FC = () => {
  const { grade, subjectId, chapterId, quizId } = useParams<{
    grade: string;
    subjectId: string;
    chapterId: string;
    quizId: string;
  }>();
  const navigate = useNavigate();
  const { user } = useAuth();
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
  const [isQuizComplete, setIsQuizComplete] = useState(false);  const [isSubmitting, setIsSubmitting] = useState(false);
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
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isQuizComplete]);

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        if (!grade || !subjectId || !chapterId || !quizId) {
          notify.error('Missing quiz parameters');
          navigate('/dashboard');
          return;
        }

        const quizData = await api.getQuiz(grade, subjectId, chapterId, quizId);

        if (!quizData) {
          setLoading(false);
          notify.error('Quiz not found');
          navigate(`/chapter/${grade}/${subjectId}/${chapterId}`, { replace: true });
          return;
        }

        setQuiz(quizData);
        setTestData(prev => ({
          ...prev,
          answers: new Array(quizData.questions.length).fill('')
        }));
      } catch (error) {
        console.error('Error loading quiz:', error);
        notify.error('Failed to load quiz');
        setLoading(false);
        navigate(`/chapter/${grade}/${subjectId}/${chapterId}`, { replace: true });
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [grade, subjectId, chapterId, quizId, navigate]);

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
    // Initialize timer when quiz loads
    if (quiz && !testStartTime && !isQuizComplete) {
      const startTime = Date.now();
      setTestStartTime(startTime);
      setQuestionStartTime(startTime);
      // Update timer display immediately
      setTimerDisplay('00:00');
    }
  }, [quiz, testStartTime, isQuizComplete]);// Timer update effect
  useEffect(() => {
    // Don't start timer if quiz hasn't started or is complete
    if (!testStartTime || isQuizComplete) return;

    // Set initial time immediately
    const updateTimer = () => {
      const elapsed = Date.now() - testStartTime;
      const minutes = Math.floor(elapsed / 60000);
      const seconds = Math.floor((elapsed % 60000) / 1000);
      setTimerDisplay(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    // Update right away
    updateTimer();

    // Set up interval for updates
    const intervalId = setInterval(updateTimer, 1000);

    // Cleanup on unmount or when dependencies change
    return () => clearInterval(intervalId);
  }, [testStartTime, isQuizComplete]);

  const selectAnswer = (optionIndex: number) => {
    if (!questionStartTime || !quiz) return;

    const newAnswers = [...testData.answers];
    newAnswers[currentQuestion] = optionIndex.toString();

    const questionTime = Date.now() - questionStartTime;
    const newQuestionTimes = [...testData.questionTimes];
    newQuestionTimes[currentQuestion] = questionTime;

    const newNavigationHistory = [
      ...testData.navigationHistory,
      { questionId: currentQuestion, timestamp: Date.now() }
    ];

    setTestData(prev => ({
      ...prev,
      answers: newAnswers,
      questionTimes: newQuestionTimes,
      navigationHistory: newNavigationHistory
    }));
  };

  const goToNextQuestion = () => {
    if (currentQuestion < quiz!.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setQuestionStartTime(Date.now());
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setQuestionStartTime(Date.now());
    }
  };
  const finishQuiz = async () => {
    if (!quiz || !testStartTime || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const time = Date.now() - testStartTime;
      let score = 0;

      quiz.questions.forEach((question, index) => {
        if (parseInt(testData.answers[index]) === question.correctIndex) {
          score++;
        }
      });

      const scorePercentage = Math.round((score / quiz.questions.length) * 100);

      // Set quiz as complete before any async operations
      setIsQuizComplete(true);

      // Wait for all async operations to complete
      if (user?.uid) {
        await Promise.all([
          progressService.updateScores(user.uid, scorePercentage),
          progressService.updateCompletedQuizzes(user.uid, quiz.id, scorePercentage, time)
        ]);
      }

      // Clear saved state after updating progress
      if (quizId && user) {
        localStorage.removeItem(`quiz_${quizId}_${user.uid}`);
      }

      // Show success notification
      notify.success('Quiz completed successfully!');

      // Small delay to ensure state updates are processed
      await new Promise(resolve => setTimeout(resolve, 100));

      // Navigate to results
      navigate('/performance', { 
        state: { score: scorePercentage, time },
        replace: true // Use replace to prevent back navigation to quiz
      });
    } catch (error) {
      notify.error('Failed to save quiz results');
      setIsSubmitting(false);
      setIsQuizComplete(false); // Reset complete state if there's an error
    }
  };

  if (loading) {
    return <Loading text="Loading quiz..." fullScreen />;
  }

  if (!quiz) {
    return <Loading text="Quiz not found..." fullScreen />;
  }

  const currentQuizQuestion = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">        {/* Quiz Header */}
        <div className="mb-8 bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 shadow-2xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white">{quiz.title}</h2>
            <div className="flex items-center bg-white/20 px-4 py-2 rounded-xl">
              <Clock className="w-5 h-5 text-white" />
              <span className="ml-2 text-white font-mono">{timerDisplay}</span>
            </div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
          {/* Question Number */}
          <div className="text-gray-500 mb-4">
            Question {currentQuestion + 1} of {quiz.questions.length}
          </div>

          {/* Question Text */}
          <h3 className="text-xl font-bold text-gray-800 mb-6">
            {currentQuizQuestion.question}
          </h3>

          {/* Options */}
          <div className="space-y-4">
            {currentQuizQuestion.options.map((option, key) => (
              <button
                key={key}
                onClick={() => selectAnswer(key)}
                className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
                  testData.answers[currentQuestion] === key.toString()
                    ? 'bg-purple-100 border-purple-500 text-purple-700'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                } border-2`}
              >
                {option}
              </button>
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between space-x-4 mt-8">
            <button
              onClick={prevQuestion}
              disabled={currentQuestion === 0}
              className={`flex items-center px-6 py-3 rounded-xl text-white transition-all duration-200 ${
                currentQuestion === 0
                  ? 'bg-white/20 cursor-not-allowed'
                  : 'bg-white/30 hover:bg-white/40'
              }`}
            >
              <ChevronLeft className="mr-2 w-5 h-5" />
              Previous
            </button>            {currentQuestion === quiz.questions.length - 1 ? (
              <button
                onClick={finishQuiz}
                disabled={isSubmitting}
                className={`flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white transition-all duration-200 ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:opacity-90'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  'Finish Quiz'
                )}
              </button>
            ) : (
              <button
                onClick={goToNextQuestion}
                disabled={!testData.answers[currentQuestion]}
                className={`flex items-center px-6 py-3 rounded-xl transition-all duration-200 ${
                  testData.answers[currentQuestion]
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                Next
                <ChevronRight className="ml-2 w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTest;