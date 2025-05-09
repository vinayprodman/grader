import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuiz } from '../../contexts/QuizContext';
import { api } from '../../services/api';
import { Quiz } from '../../types/education';
import '../../styles/QuizResults.css';

const QuizResults: React.FC = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { getQuizResult } = useQuiz();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuizData = async () => {
      console.log('QuizResults: Starting to load quiz data');
      console.log('QuizResults: quizId from params:', quizId);
      
      try {
        if (!quizId) {
          console.log('QuizResults: No quizId found, redirecting to dashboard');
          navigate('/dashboard');
          return;
        }

        console.log('QuizResults: Fetching quiz data for ID:', quizId);
        const quizData = await api.getQuiz(quizId);
        console.log('QuizResults: Received quiz data:', quizData);

        if (quizData) {
          setQuiz(quizData);
        } else {
          console.log('QuizResults: No quiz data found, redirecting to dashboard');
          navigate('/dashboard');
        }
      } catch (error) {
        console.error('QuizResults: Error loading quiz:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadQuizData();
  }, [quizId, navigate]);

  if (loading) {
    console.log('QuizResults: Rendering loading state');
    return (
      <div className="loading">
        <div className="dots-container">
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
        <div className="loading-text">Loading results...</div>
      </div>
    );
  }

  if (!quiz) {
    console.log('QuizResults: No quiz found, rendering not found message');
    return <div>Quiz not found</div>;
  }

  const result = getQuizResult(quizId);
  console.log('QuizResults: Quiz result:', result);

  if (!result) {
    console.log('QuizResults: No result found, redirecting to dashboard');
    navigate('/dashboard');
    return null;
  }

  const { score, accuracy, time, correctAnswers, totalQuestions } = result;
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);

  return (
    <div className="quiz-results">
      <div className="nav-header">
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="nav-title">Quiz Results</div>
      </div>

      <div className="results-content">
        <div className="score-section">
          <div className="score-circle">
            <span className="score-value">{Math.round(score)}%</span>
            <span className="score-label">Score</span>
          </div>
          <div className="score-details">
            <div className="detail-item">
              <span className="detail-label">Accuracy</span>
              <span className="detail-value">{Math.round(accuracy)}%</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Time</span>
              <span className="detail-value">{minutes}:{seconds.toString().padStart(2, '0')}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Correct Answers</span>
              <span className="detail-value">{correctAnswers}/{totalQuestions}</span>
            </div>
          </div>
        </div>

        <div className="results-actions">
          <button 
            className="btn btn-primary"
            onClick={() => navigate(`/quiz/${quizId}`)}
          >
            Retry Quiz
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults; 