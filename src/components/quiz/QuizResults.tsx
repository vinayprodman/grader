import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import '../../styles/QuizResults.css';

interface QuizResultsProps {
  score: number;
  accuracy: number;
  totalTime: number;
  correctAnswers: number;
  totalQuestions: number;
}

const QuizResults: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const results = location.state as QuizResultsProps;

  const getScoreClass = (score: number) => {
    if (score >= 80) return 'score-good';
    if (score >= 60) return 'score-fair';
    return 'score-poor';
  };

  const getFeedbackMessage = (score: number) => {
    if (score >= 80) return 'Excellent work!';
    if (score >= 60) return 'Good effort!';
    return 'Keep practicing!';
  };

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="results-screen">
      <div className="container">
        <div className="nav-header">
          <div className="nav-title">Test Complete!</div>
        </div>
        
        <div className="card results-card animate-slide-up">
          <h2 className="feedback-message">
            {getFeedbackMessage(results.score)}
          </h2>
          
          <div className={`score-circle ${getScoreClass(results.score)}`}>
            {Math.round(results.score)}%
          </div>
          
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">Score</div>
              <div className="stat-value">
                {results.correctAnswers}/{results.totalQuestions}
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Accuracy</div>
              <div className="stat-value">
                {Math.round(results.accuracy)}%
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Time Taken</div>
              <div className="stat-value">
                {formatTime(results.totalTime)}
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Status</div>
              <div className="stat-value" style={{ color: 'var(--success-color)' }}>
                Complete
              </div>
            </div>
          </div>
          
          <button 
            className="btn btn-primary btn-block"
            style={{ marginTop: '2rem' }}
            onClick={() => navigate('/dashboard')}
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults; 