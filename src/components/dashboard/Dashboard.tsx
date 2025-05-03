import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { quizData } from '../../data/quizData';
import { Award, BookOpen, LogOut } from 'lucide-react';
import '../../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  // Filter quizzes based on user's grade level
  const userGradeLevel = user?.grade || '';
  const gradeNumber = parseInt(userGradeLevel.split(' ')[0]) || 0;
  console.log(gradeNumber)
  
  // Get appropriate quizzes for user's grade level (±1 grade)
  const recommendedQuizzes = quizData.filter(quiz => {
    // Match with levels roughly corresponding to grades
    return Math.abs(quiz.level - gradeNumber) <= 1;
  });
  
  const handleQuizSelect = (quizId: string) => {
    navigate(`/quiz/start/${quizId}`);
  };
  
  const handleViewProgress = () => {
    navigate('/progress');
  };
  
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo">
          <BookOpen size={32} color="#4a6ee0" />
          <h1>grader</h1>
        </div>
        <div className="user-info">
          <span>Hi, {user?.name} 👋</span>
          <button className="icon-button" onClick={handleLogout}>
            <LogOut size={20} />
          </button>
        </div>
      </header>
      
      <div className="welcome-banner">
        <h2>Welcome to grader!</h2>
        <p>Choose a quiz to challenge yourself and earn badges.</p>
      </div>
      
      <div className="stats-summary">
        <div className="stat-card">
          <span className="stat-value">4</span>
          <span className="stat-label">Quizzes Available</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">2</span>
          <span className="stat-label">Completed</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">85%</span>
          <span className="stat-label">Average Score</span>
        </div>
      </div>
      
      <section className="quiz-section">
        <div className="section-header">
          <h3>Recommended Quizzes</h3>
          <button className="view-all-btn" onClick={handleViewProgress}>
            <Award size={16} />
            View My Progress
          </button>
        </div>
        
        <div className="quiz-list">
          {recommendedQuizzes.map((quiz) => (
            <div 
              key={quiz.id} 
              className="quiz-card"
              onClick={() => handleQuizSelect(quiz.id)}
            >
              <div className="quiz-icon">{quiz.icon}</div>
              <div className="quiz-details">
                <h4>{quiz.title}</h4>
                <p>{quiz.description}</p>
                <div className="quiz-meta">
                  <span className="quiz-level">Level {quiz.level}</span>
                  <span className="quiz-questions">10 Questions</span>
                  <span className="quiz-price">₹{quiz.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <div className="motivation-card">
        <p>"Learning is a treasure that will follow its owner everywhere!"</p>
      </div>
    </div>
  );
};

export default Dashboard;