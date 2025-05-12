import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PerformanceSummary from './PerformanceSummary';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'performance'>('dashboard');
  const navigate = useNavigate();

  const handleTabClick = (tab: 'dashboard' | 'performance') => {
    setActiveTab(tab);
  };

  const handleTestClick = (testId: string) => {
    navigate(`/test/${testId}`);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-tabs">
        <button
          className={`dashboard-tab${activeTab === 'dashboard' ? ' active' : ''}`}
          onClick={() => handleTabClick('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`dashboard-tab${activeTab === 'performance' ? ' active' : ''}`}
          onClick={() => handleTabClick('performance')}
        >
          Performance Summary
        </button>
      </div>

      {activeTab === 'dashboard' && (
        <>
          <div className="welcome-banner">
            <h2>Welcome back, demo2!</h2>
            <p>Continue your learning journey</p>
          </div>
          <div className="test-grid">
            <div className="test-card" onClick={() => handleTestClick('fractions')}>
              <div className="test-icon">📊</div>
              <div className="test-info">
                <h3>Fractions</h3>
                <p>10 questions • 15 minutes</p>
              </div>
              <span className="test-status">Available</span>
            </div>
            <div className="test-card locked">
              <div className="test-icon">🔢</div>
              <div className="test-info">
                <h3>Decimals</h3>
                <p>10 questions • 15 minutes</p>
              </div>
              <span className="test-status">Locked</span>
            </div>
            <div className="test-card locked">
              <div className="test-icon">📐</div>
              <div className="test-info">
                <h3>Geometry</h3>
                <p>10 questions • 15 minutes</p>
              </div>
              <span className="test-status">Locked</span>
            </div>
            <div className="test-card locked">
              <div className="test-icon">📈</div>
              <div className="test-info">
                <h3>Algebra</h3>
                <p>10 questions • 15 minutes</p>
              </div>
              <span className="test-status">Locked</span>
            </div>
          </div>
        </>
      )}
      {activeTab === 'performance' && <PerformanceSummary />}
    </div>
  );
};

export default Dashboard; 