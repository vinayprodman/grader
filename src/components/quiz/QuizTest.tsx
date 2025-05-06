import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/QuizTest.css';

interface Question {
  question: string;
  options: string[];
  correct: string;
}

interface TestData {
  answers: string[];
  questionTimes: number[];
  navigationHistory: Array<{
    from: number;
    to: number;
    action: string;
  }>;
}

const QuizTest: React.FC = () => {
  const navigate = useNavigate();
  const { testId } = useParams();
  const { user } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [testStartTime, setTestStartTime] = useState<number | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [testData, setTestData] = useState<TestData>({
    answers: [],
    questionTimes: [],
    navigationHistory: []
  });

  // Sample questions - In a real app, these would come from an API
  const questions: Question[] = [
    {
      question: "What is 0.5 + 0.3?",
      options: ["0.8", "0.7", "0.9", "0.6"],
      correct: "A"
    },
    {
      question: "What is 2.7 - 1.4?",
      options: ["1.1", "1.2", "1.3", "1.4"],
      correct: "C"
    },
    {
      question: "What is 0.6 × 0.5?",
      options: ["0.3", "0.25", "0.35", "0.4"],
      correct: "A"
    }
  ];

  useEffect(() => {
    startTest();
    return () => {
      if (timerInterval) {
        clearInterval(timerInterval);
      }
    };
  }, []);

  const startTest = () => {
    setCurrentQuestion(0);
    setTestData({
      answers: [],
      questionTimes: [],
      navigationHistory: []
    });
    setTestStartTime(Date.now());
    setQuestionStartTime(Date.now());
    startTimer();
  };

  const startTimer = () => {
    const interval = setInterval(() => {
      // Timer logic here
    }, 1000);
    setTimerInterval(interval);
  };

  const loadQuestion = (index: number) => {
    const question = questions[index];
    const progress = ((index + 1) / questions.length) * 100;
    
    // Update progress bar
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) {
      progressFill.style.width = `${progress}%`;
    }

    // Update navigation buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    if (prevBtn) {
      prevBtn.style.visibility = index === 0 ? 'hidden' : 'visible';
    }
    if (nextBtn) {
      nextBtn.innerHTML = index === questions.length - 1 ? 'Submit Test' : 'Next →';
      nextBtn.onclick = index === questions.length - 1 ? submitTest : nextQuestion;
    }
  };

  const selectAnswer = (element: HTMLElement, answer: string) => {
    document.querySelectorAll('.answer-option').forEach(option => {
      option.classList.remove('selected');
    });
    element.classList.add('selected');
    setTestData(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [currentQuestion]: answer
      }
    }));
  };

  const nextQuestion = () => {
    if (!testData.answers[currentQuestion]) {
      showNotification('Please select an answer before proceeding.');
      return;
    }

    // Record time spent on question
    const timeSpent = Date.now() - (questionStartTime || 0);
    setTestData(prev => ({
      ...prev,
      questionTimes: {
        ...prev.questionTimes,
        [currentQuestion]: timeSpent
      },
      navigationHistory: [
        ...prev.navigationHistory,
        { from: currentQuestion, to: currentQuestion + 1, action: 'next' }
      ]
    }));

    setQuestionStartTime(Date.now());
    setCurrentQuestion(prev => prev + 1);
    loadQuestion(currentQuestion + 1);
  };

  const prevQuestion = () => {
    // Record time spent on question
    const timeSpent = Date.now() - (questionStartTime || 0);
    setTestData(prev => ({
      ...prev,
      questionTimes: {
        ...prev.questionTimes,
        [currentQuestion]: timeSpent
      },
      navigationHistory: [
        ...prev.navigationHistory,
        { from: currentQuestion, to: currentQuestion - 1, action: 'prev' }
      ]
    }));

    setQuestionStartTime(Date.now());
    setCurrentQuestion(prev => prev - 1);
    loadQuestion(currentQuestion - 1);
  };

  const submitTest = () => {
    if (!testData.answers[currentQuestion]) {
      showNotification('Please select an answer before submitting.');
      return;
    }

    if (timerInterval) {
      clearInterval(timerInterval);
    }

    // Calculate results
    const totalTime = Date.now() - (testStartTime || 0);
    let correctAnswers = 0;

    questions.forEach((q, index) => {
      if (testData.answers[index] === q.correct) {
        correctAnswers++;
      }
    });

    const score = (correctAnswers / questions.length) * 100;
    const accuracy = score;

    // Save test results
    const testResults = JSON.parse(localStorage.getItem('testResults') || '[]');
    testResults.push({
      chapter: 'Decimals',
      score: score,
      accuracy: accuracy,
      time: totalTime,
      date: new Date().toISOString()
    });
    localStorage.setItem('testResults', JSON.stringify(testResults));

    // Navigate to results page
    navigate(`/quiz-results/${testId}`, {
      state: {
        score,
        accuracy,
        totalTime,
        correctAnswers,
        totalQuestions: questions.length
      }
    });
  };

  const showNotification = (message: string) => {
    // Create notification element
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

  return (
    <div className="test-screen">
      <div className="container">
        <div className="nav-header">
          <div className="nav-title">Decimals Test</div>
          <div id="timer" style={{ fontWeight: 600 }}>00:00</div>
        </div>
        
        <div className="progress-bar">
          <div className="progress-fill" id="progress-fill" style={{ width: '33.33%' }}></div>
        </div>
        
        <div className="question-card animate-slide-up">
          <div className="question-text" id="question-text">
            {questions[currentQuestion]?.question}
          </div>
          <div className="answer-options" id="answer-options">
            {questions[currentQuestion]?.options.map((option, index) => (
              <div
                key={index}
                className="answer-option"
                onClick={(e) => selectAnswer(e.currentTarget, String.fromCharCode(65 + index))}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
        
        <div className="test-navigation">
          <button
            className="btn btn-secondary"
            onClick={prevQuestion}
            id="prev-btn"
            style={{ visibility: currentQuestion === 0 ? 'hidden' : 'visible' }}
          >
            ← Previous
          </button>
          <button
            className="btn btn-primary"
            onClick={currentQuestion === questions.length - 1 ? submitTest : nextQuestion}
            id="next-btn"
          >
            {currentQuestion === questions.length - 1 ? 'Submit Test' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizTest; 