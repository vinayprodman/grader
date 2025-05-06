import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Trophy, ArrowLeft, RefreshCw } from 'lucide-react';
import '../../styles/TestResults.css';

interface TestResults {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
}

const TestResults: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const results = location.state as TestResults;

  if (!results) {
    return (
      <div className="error-container">
        <h2>No Results Found</h2>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/dashboard')}
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'var(--success-color)';
    if (score >= 60) return 'var(--warning-color)';
    return 'var(--error-color)';
  };

  const getScoreMessage = (score: number) => {
    if (score >= 80) return 'Excellent!';
    if (score >= 60) return 'Good job!';
    return 'Keep practicing!';
  };

  return (
    <div className="results-container">
      <div className="results-card">
        <div className="results-header">
          <Trophy size={64} color={getScoreColor(results.score)} />
          <h2>Test Results</h2>
          <p className="score-message">{getScoreMessage(results.score)}</p>
        </div>

        <div className="results-summary">
          <div className="score-circle" style={{ borderColor: getScoreColor(results.score) }}>
            <span className="score-value">{Math.round(results.score)}%</span>
          </div>

          <div className="results-details">
            <div className="detail-item">
              <span className="detail-label">Correct Answers</span>
              <span className="detail-value">{results.correctAnswers} / {results.totalQuestions}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Accuracy</span>
              <span className="detail-value">{Math.round(results.score)}%</span>
            </div>
          </div>
        </div>

        <div className="results-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate(-2)}
          >
            <ArrowLeft size={20} />
            Back to Chapter
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/dashboard')}
          >
            <RefreshCw size={20} />
            Try Another Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestResults; 