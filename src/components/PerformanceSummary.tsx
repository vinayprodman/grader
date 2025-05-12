import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PerformanceSummary.css';

const PerformanceSummary = () => {
  const navigate = useNavigate();

  return (
    <div className="performance-container">
      <div className="nav-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <div className="nav-title">Performance Summary</div>
      </div>

      <div className="card animate-slide-up">
        <h3 style={{ marginBottom: '0.5rem' }}>Performance Overview</h3>
        <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>
          Track your child's progress
        </p>

        <div className="subject-performance">
          <div className="subject-header">
            <div className="subject-info">
              <div className="subject-icon completed">📊</div>
              <div>
                <div className="subject-name">Fractions</div>
                <div className="subject-status">Completed</div>
              </div>
            </div>
            <span className="status-icon completed">✓</span>
          </div>

          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">Average Score</div>
              <div className="stat-value">85%</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Time Spent</div>
              <div className="stat-value">12:30</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Accuracy</div>
              <div className="stat-value">90%</div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Weak Areas</div>
              <div className="stat-value">Mixed Numbers</div>
            </div>
          </div>
        </div>

        <div className="subject-performance">
          <div className="subject-header">
            <div className="subject-info">
              <div className="subject-icon in-progress">🔢</div>
              <div>
                <div className="subject-name">Decimals</div>
                <div className="subject-status">In Progress</div>
              </div>
            </div>
            <span className="status-icon in-progress">0/10</span>
          </div>

          <div className="test-progress">
            <div className="progress-item">
              <div className="progress-dot available"></div>
              <span>Tests available: 3</span>
            </div>
            <div className="progress-item">
              <div className="progress-dot locked"></div>
              <span>Locked: 7</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceSummary; 