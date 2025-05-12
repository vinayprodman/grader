import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuiz } from '../../contexts/QuizContext';
import { useAuth } from '../../contexts/AuthContext';
import { api } from '../../services/api';
import { Quiz } from '../../types/education';
import '../../styles/QuizResults.css';
import Loading from '../common/Loading';

const QuizResults: React.FC = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { getQuizResult } = useQuiz();
  const { user } = useAuth();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [chapterId, setChapterId] = useState<string | null>(null);

  useEffect(() => {
    const validateAccess = async () => {
      if (!quizId || !user) {
        navigate('/dashboard');
        return;
      }

      try {
        // Check if user has completed this quiz
        const result = getQuizResult(quizId);
        if (!result) {
          console.log('QuizResults: No result found for this quiz');
          navigate('/dashboard');
          return;
        }

        // Check if quiz exists and get chapter ID
        const quizData = await api.getQuiz(quizId);
        if (!quizData) {
          console.log('QuizResults: Quiz not found');
          navigate('/dashboard');
          return;
        }

        setQuiz(quizData);
        setChapterId(quizData.chapterId);
        setIsAuthorized(true);
      } catch (error) {
        console.error('QuizResults: Error validating access:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    validateAccess();
  }, [quizId, user, navigate, getQuizResult]);

  // Prevent going back to quiz
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      if (chapterId) {
        navigate(`/subjects/${quiz?.subjectId}/chapters/${chapterId}`);
      } else {
        navigate('/dashboard');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [navigate, chapterId, quiz?.subjectId]);

  if (loading) {
    return <Loading text="Loading results..." fullScreen />;
  }

  if (!isAuthorized) {
    return <Loading text="Redirecting..." fullScreen />;
  }

  const result = getQuizResult(quizId);
  if (!result) {
    navigate('/dashboard');
    return null;
  }

  const { score, accuracy, time, correctAnswers, totalQuestions } = result;
  const minutes = Math.floor(time / 60000);
  const seconds = Math.floor((time % 60000) / 1000);

  const handleBackToChapter = () => {
    if (chapterId) {
      navigate(`/subjects/${quiz.subjectId}/chapters/${chapterId}`);
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <div className="quiz-results">
      <div className="nav-header">
        <button className="btn btn-ghost" onClick={handleBackToChapter}>
          ← Back to Chapter
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
            className="btn btn-secondary"
            onClick={handleBackToChapter}
          >
            Back to Chapter
          </button>
          <button 
            className="btn btn-primary"
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