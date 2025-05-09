import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useQuiz } from '../../contexts/QuizContext';
import { api } from '../../services/api';
import { Quiz } from '../../types/education';
import '../../styles/QuizTest.css';

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
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addQuizResult } = useQuiz();
  
  console.log('QuizTest: Component mounted with quizId:', quizId);
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [testStartTime, setTestStartTime] = useState<number | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [testData, setTestData] = useState<TestData>({
    answers: [],
    questionTimes: [],
    navigationHistory: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuiz = async () => {
      console.log('QuizTest: Starting to load quiz data');
      console.log('QuizTest: quizId from params:', quizId);
      
      try {
        if (!quizId) {
          console.log('QuizTest: No quizId found, redirecting to dashboard');
          navigate('/dashboard');
          return;
        }

        console.log('QuizTest: Fetching quiz data for ID:', quizId);
        const quizData = await api.getQuiz(quizId);
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

  useEffect(() => {
    if (quiz && !testStartTime) {
      console.log('QuizTest: Starting test for quiz:', quiz.id);
      startTest();
    }
  }, [quiz]);

  const startTest = () => {
    console.log('QuizTest: Starting test timer');
    const now = Date.now();
    setTestStartTime(now);
    setQuestionStartTime(now);
    startTimer();
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      const timerElement = document.getElementById('timer');
      if (timerElement) {
        const elapsed = Math.floor((Date.now() - (testStartTime || Date.now())) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      }
    }, 1000);
    setTimerInterval(interval);
  };

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

  const handleSubmit = () => {
    if (!quiz || !testStartTime) return;

    const correctAnswers = Object.values(testData.answers).filter(
      (answer, index) => answer === String(quiz.questions[index].answer_key)
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

    addQuizResult(result);
    navigate(`/quiz-results/${quiz.id}`);
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
    console.log('QuizTest: Rendering loading state');
    return (
      <div className="loading">
        <div className="dots-container">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
        <div className="loading-text">Loading quiz...</div>
      </div>
    );
  }

  if (!quiz) {
    console.log('QuizTest: No quiz found, rendering not found message');
    return <div>Quiz not found</div>;
  }

  console.log('QuizTest: Rendering quiz:', { quiz, currentQuestion });

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

  return (
    <div className="quiz-test">
      <div className="nav-header">
        <div className="nav-title">{quiz.title}</div>
        <div id="timer" className="timer">00:00</div>
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
    </div>
  );
};

export default QuizTest; 