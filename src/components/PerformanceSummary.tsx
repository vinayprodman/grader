import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/PerformanceSummary.css';

const PerformanceSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { score, time } = location.state || {};

  // Format time in mm:ss
  const formatTime = (ms: number) => {
    if (!ms) return '00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="performance-container">
      <div className="nav-header">
        <div className="nav-title">Quiz Summary</div>
      </div>
      <div className="card animate-slide-up" style={{ textAlign: 'center' }}>
        <h3 style={{ marginBottom: '1rem' }}>Your Quiz Results</h3>
        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
          <div className="stat-item">
            <div className="stat-label">Score</div>
            <div className="stat-value">{score !== undefined ? `${score.toFixed(2)}%` : '--'}</div>
          </div>
          <div className="stat-item">
            <div className="stat-label">Time Taken</div>
            <div className="stat-value">{formatTime(time)}</div>
          </div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => navigate('/dashboard')}
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PerformanceSummary; 