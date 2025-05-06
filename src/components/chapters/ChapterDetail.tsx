import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { chapterData } from '../../data/chapterData';
import { Test } from '../../data/chapterData';
import '../../styles/ChapterDetail.css';

const ChapterDetail: React.FC = () => {
  const { chapterId } = useParams();
  const navigate = useNavigate();
  
  const chapter = chapterData.find(c => c.id === chapterId);
  
  if (!chapter) {
    return <div>Chapter not found</div>;
  }

  const handleTestClick = (test: Test) => {
    if (test.isLocked) {
      // Show locked message
      return;
    }
    navigate(`/test/${test.id}`);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="chapter-detail">
      <div className="nav-header">
        <button className="btn btn-ghost" onClick={() => navigate('/dashboard')}>
          ← Back
        </button>
        <div className="nav-title">{chapter.title}</div>
      </div>

      {chapter.status === 'completed' && (
        <div className="performance-summary">
          <h3>Performance Summary</h3>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-label">Score</div>
              <div className="stat-value" style={{ color: 'var(--success-color)' }}>
                {chapter.score}%
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Time</div>
              <div className="stat-value">
                {chapter.timeSpent ? formatTime(chapter.timeSpent) : 'N/A'}
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Accuracy</div>
              <div className="stat-value" style={{ color: 'var(--success-color)' }}>
                {chapter.accuracy}%
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-label">Status</div>
              <div className="stat-value" style={{ color: 'var(--success-color)' }}>
                Complete
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="tests-section">
        <h3>Available Tests</h3>
        <p className="section-subtitle">Complete tests to unlock more content</p>
        
        <div className="test-grid">
          {chapter.tests.map((test) => (
            <button
              key={test.id}
              className={`test-btn ${test.isLocked ? 'locked' : ''}`}
              onClick={() => handleTestClick(test)}
            >
              <span className="test-info">
                <span className="test-icon">
                  {test.isLocked ? '🔒' : test.id.split('-')[1]}
                </span>
                <span>{test.title}</span>
              </span>
              <span className="test-meta">
                {test.isLocked ? (
                  <span className="locked-text">
                    {test.requiredScore ? `Score ${test.requiredScore}% to unlock` : 'Locked'}
                  </span>
                ) : (
                  <span className="test-details">
                    {test.questions} Questions • {test.timeLimit} min
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChapterDetail; 