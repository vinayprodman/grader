import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QuizProvider, useQuiz } from '../../contexts/QuizContext';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen } from 'lucide-react';
import { api } from '../../services/api';
import '../../styles/Quiz.css';
import Loading from '../common/Loading';

const QuizStartContent: React.FC = () => {
  const { currentQuiz, totalQuestions } = useQuiz();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { quizId } = useParams<{ quizId: string }>();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  useEffect(() => {
    const validateAccess = async () => {
      if (!quizId || !user) {
        navigate('/dashboard');
        return;
      }

      try {
        // Check if quiz exists
        const quizData = await api.getQuiz(quizId);
        if (!quizData) {
          console.log('QuizStart: Quiz not found');
          navigate('/dashboard');
          return;
        }

        // Check if user has already completed this quiz
        const savedState = localStorage.getItem(`quiz_${quizId}_${user.uid}`);
        if (savedState) {
          const { isComplete } = JSON.parse(savedState);
          if (isComplete) {
            console.log('QuizStart: Quiz already completed');
            navigate(`/quiz-results/${quizId}`);
            return;
          }
        }

        setIsAuthorized(true);
      } catch (error) {
        console.error('QuizStart: Error validating access:', error);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };

    validateAccess();
  }, [quizId, user, navigate]);
  
  if (loading) {
    return <Loading text="Loading quiz..." fullScreen />;
  }

  if (!isAuthorized || !currentQuiz) {
    return <Loading text="Redirecting..." fullScreen />;
  }
  
  const handleStartQuiz = () => {
    navigate(`/quiz/${quizId}`);
  };
  
  const handleBackToDashboard = () => {
    navigate('/dashboard');
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