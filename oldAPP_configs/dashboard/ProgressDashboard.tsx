import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useQuiz } from '../../contexts/QuizContext';
import { quizData } from '../../data/quizData';
import { Award } from 'lucide-react';
import BackButton from '../common/BackButton';
import '../../styles/ProgressDashboard.css';

const ProgressDashboard: React.FC = () => {
  const { user } = useAuth();
  const { quizResults } = useQuiz();
  const navigate = useNavigate();
  
  // Calculate statistics with null checks
  const safeQuizResults = quizResults || [];
  const totalQuizzes = safeQuizResults.length;
  const averageScore = totalQuizzes > 0
    ? Math.round((safeQuizResults.reduce((sum, result) => sum + (result.score / result.totalQuestions * 100), 0) / totalQuizzes))
    : 0;
    
  // Determine badges based on performance
  const badges = [];
  
  if (totalQuizzes >= 1) badges.push('🎓'); // Participated
  if (totalQuizzes >= 5) badges.push('🚀'); // Dedicated learner
  if (averageScore >= 70) badges.push('⭐'); // Good performer
  if (averageScore >= 90) badges.push('🏆'); // Excellent performer
  if (safeQuizResults.some(result => result.score === result.totalQuestions)) {
    badges.push('🥇'); // Perfect score
  }
  
  // Most recent quiz results (limit to last 5)
  const recentResults = [...safeQuizResults]
    .sort((a, b) => {
      const aDate = a.completedAt ? new Date(a.completedAt).getTime() : (a.date ? new Date(a.date).getTime() : 0);
      const bDate = b.completedAt ? new Date(b.completedAt).getTime() : (b.date ? new Date(b.date).getTime() : 0);
      return bDate - aDate;
    })
    .slice(0, 5);
  
  return (
    <div className="container dashboard-screen">
      <div className="dashboard-header">
        <BackButton to="/" label="Back" />
        <h1>Student Progress</h1>
      </div>
      
      <h2>Keep up the great work, {user?.profile?.name || user?.displayName || 'Student'}!</h2>
      
      <div className="stat-cards">
        <div className="stat-card">
          <span className="stat-label">Total Tests</span>
          <span className="stat-value">{totalQuizzes}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Average Score</span>
          <span className="stat-value">{averageScore}%</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Badges</span>
          <span className="stat-value">{badges.length}</span>
        </div>
      </div>
      
      <h3>Your Badges</h3>
      <div className="badges-container">
        {badges.length > 0 ? (
          badges.map((badge, index) => (
            <div key={index} className="badge-item">{badge}</div>
          ))
        ) : (
          <p>Complete quizzes to earn badges!</p>
        )}
      </div>
      
      <h3>Recent Quiz Results</h3>
      <div className="results-container">
        {recentResults.length > 0 ? (
          recentResults.map((result, index) => {
            const quiz = quizData.find((q: any) => q.id === result.quizId);
            return (
              <div key={index} className="result-card">
                <div className="result-header">
                  <h4>{quiz?.title || 'Quiz'}</h4>
                  <span className="result-date">
                    {result.completedAt ? new Date(result.completedAt).toLocaleDateString() : (result.date ? new Date(result.date).toLocaleDateString() : '')}
                  </span>
                </div>
                <div className="result-score">
                  Score: {result.score}/{result.totalQuestions} ({Math.round((result.score / result.totalQuestions) * 100)}%)
                </div>
                <div className="result-feedback">
                  <div>
                    <strong>Strengths:</strong>
                    <ul>
                      {(result.strengths || []).map((strength: string, i: number) => (
                        <li key={i}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <strong>Areas to Improve:</strong>
                    <ul>
                      {(result.weaknesses || []).map((weakness: string, i: number) => (
                        <li key={i}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>No quiz results yet. Start taking quizzes!</p>
        )}
      </div>
      
      <div className="quote-box">
        <p className="quote-text">Keep Learning, Little Genius! 💡</p>
      </div>
      
      <button className="btn" onClick={() => navigate('/')}>
        Take Another Quiz
      </button>
    </div>
  );
};

export default ProgressDashboard;