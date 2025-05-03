import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QuizProvider, useQuiz } from '../../contexts/QuizContext';
import { BookOpen } from 'lucide-react';
import '../../styles/Quiz.css';

const QuizStartContent: React.FC = () => {
  const { currentQuiz, totalQuestions } = useQuiz();
  const navigate = useNavigate();
  const { quizId } = useParams<{ quizId: string }>();
  
  if (!currentQuiz) {
    return <div>Quiz not found</div>;
  }
  
  const handleStartQuiz = () => {
    navigate(`/quiz/${quizId}`);
  };
  
  const handleBackToDashboard = () => {
    navigate('/');
  };
  
  return (
    <div className="container start-screen">
      <div className="logo-container">
        <BookOpen size={60} color="#4a6ee0" />
      </div>
      <h1>Ready to Challenge Yourself?</h1>
      <h2>Let's test your knowledge on {currentQuiz.title}!</h2>
      
      <div className="quiz-info">
        <div className="info-item">
          <span className="value">{totalQuestions}</span>
          <span className="label">Questions</span>
        </div>
        <div className="info-item">
          <span className="value">5</span>
          <span className="label">Minutes</span>
        </div>
        <div className="info-item">
          <span className="value">₹{currentQuiz.price}</span>
          <span className="label">Price</span>
        </div>
      </div>
      
      <div className="quiz-description">
        <p>{currentQuiz.description}</p>
      </div>
      
      <button className="btn" onClick={handleStartQuiz}>Start Quiz</button>
      <button className="btn btn-secondary" onClick={handleBackToDashboard}>Back to Dashboard</button>
    </div>
  );
};

const QuizStart: React.FC = () => {
  return (
    <QuizProvider>
      <QuizStartContent />
    </QuizProvider>
  );
};

export default QuizStart;