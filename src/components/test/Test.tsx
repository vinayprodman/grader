import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { chapterData } from '../../data/chapterData';
import { Test as TestType } from '../../data/chapterData';
import '../../styles/Test.css';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

const Test: React.FC = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState<TestType | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Find the test in chapterData
    const foundTest = chapterData
      .flatMap(chapter => chapter.tests)
      .find(t => t.id === testId);

    if (foundTest) {
      setTest(foundTest);
      setTimeLeft(foundTest.timeLimit * 60); // Convert minutes to seconds
      
      // Generate sample questions (replace with actual questions from your backend)
      const sampleQuestions: Question[] = Array(foundTest.questions)
        .fill(null)
        .map((_, index) => ({
          id: `q${index + 1}`,
          text: `Sample question ${index + 1}?`,
          options: ['Option A', 'Option B', 'Option C', 'Option D'],
          correctAnswer: Math.floor(Math.random() * 4)
        }));
      
      setQuestions(sampleQuestions);
      setAnswers(new Array(sampleQuestions.length).fill(-1));
    }
    
    setLoading(false);
  }, [testId]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      handleSubmit();
    }
  }, [timeLeft]);

  const handleAnswerSelect = (index: number) => {
    setSelectedAnswer(index);
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestion] = index;
      return newAnswers;
    });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
    }
  };

  const handleSubmit = () => {
    const score = answers.reduce((acc, answer, index) => {
      return acc + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);
    
    const percentage = (score / questions.length) * 100;
    navigate(`/test/${testId}/results`, { 
      state: { 
        score: percentage,
        totalQuestions: questions.length,
        correctAnswers: score
      }
    });
  };

  if (loading) {
    return <div className="loading">Loading test...</div>;
  }

  if (!test) {
    return <div className="error">Test not found</div>;
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="test-container">
      <div className="test-header">
        <button 
          className="btn btn-ghost"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <div className="test-info">
          <h2>{test.title}</h2>
          <div className="test-meta">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span className="timer">Time Left: {formatTime(timeLeft)}</span>
          </div>
        </div>
      </div>

      <div className="question-container">
        <div className="question">
          <h3>{questions[currentQuestion].text}</h3>
          <div className="options">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                className={`option ${selectedAnswer === index ? 'selected' : ''}`}
                onClick={() => handleAnswerSelect(index)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="navigation">
          <button
            className="btn btn-secondary"
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
          >
            Previous
          </button>
          
          {currentQuestion === questions.length - 1 ? (
            <button
              className="btn btn-primary"
              onClick={handleSubmit}
            >
              Submit
            </button>
          ) : (
            <button
              className="btn btn-primary"
              onClick={handleNext}
            >
              Next
            </button>
          )}
        </div>
      </div>

      <div className="progress-bar">
        {questions.map((_, index) => (
          <div
            key={index}
            className={`progress-dot ${index === currentQuestion ? 'active' : ''} ${answers[index] !== -1 ? 'answered' : ''}`}
            onClick={() => setCurrentQuestion(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Test; 