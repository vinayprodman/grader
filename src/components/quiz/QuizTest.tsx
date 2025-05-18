import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useQuiz } from '../../contexts/QuizContext';
import { api } from '../../services/api';
import { progressService } from '../../services/progressService';
import { Quiz } from '../../types/education';
import '../../styles/QuizTest.css';
import Loading from '../common/Loading';

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
          setTimeout(() => navigate('/dashboard'), 2000);
        }
      } catch (error) {
        console.error('QuizTest: Error loading quiz:', error);
        setLoading(false);
        showNotification('Error loading quiz. Please try again.');
        setTimeout(() => navigate('/dashboard'), 2000);
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
    }, 2000);
  };

  if (loading) {
    return <Loading text="Loading quiz..." fullScreen />;
  }

  if (!quiz) {
    return <Loading text="Quiz not found..." fullScreen />;
  }

  console.log('QuizTest: Rendering quiz:', { quiz, currentQuestion });

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="quiz-test-container">
      {/* Timer at the top */}
      <div style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '1.5rem', margin: '1rem 0' }}>
        Time: <span id="timer">{timerDisplay}</span>
      </div>
      <div className="quiz-test">
        <div className="nav-header">
          <div className="nav-title">{quiz.title}</div>
        </div>
        
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="question-card">
          <div className="question-text">
            {currentQ.question}
          </div>
          <div className="answer-options">
            {Object.entries(currentQ.options).map(([key, value]) => (
              <div
                key={key}
                className={`answer-option ${
                  testData.answers[currentQuestion] === key ? 'selected' : ''
                }`}
                onClick={() => selectAnswer(key)}
              >
                {value}
              </div>
            ))}
          </div>
        </div>
        
        <div className="test-navigation">
          <button
            className="btn btn-secondary"
            onClick={prevQuestion}
            style={{ visibility: currentQuestion === 0 ? 'hidden' : 'visible' }}
          >
            ← Previous
          </button>
          <button
            className="btn btn-primary"
            onClick={nextQuestion}
          >
            {currentQuestion === quiz.questions.length - 1 ? 'Submit' : 'Next →'}
          </button>
        </div>
        // For dev only need to remove
        <button
          className="submit-quiz-btn"
          style={{ marginTop: '2rem', padding: '1rem 2rem', fontSize: '1.2rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          onClick={handleSubmit}
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizTest; 