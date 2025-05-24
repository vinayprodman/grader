import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QuizProvider, useQuiz } from '../../contexts/QuizContext';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen } from 'lucide-react';
import { api } from '../../services/api';
import '../../styles/Quiz.css';
import Loading from '../common/Loading';

const QuizStartContent: React.FC = () => {
  const { currentQuiz } = useQuiz();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { grade, subjectId, chapterId, quizId } = useParams<{
    grade: string;
    subjectId: string;
    chapterId: string;
    quizId: string;
  }>();
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  useEffect(() => {
    const validateAccess = async () => {
      if (!quizId || !user || !grade || !subjectId || !chapterId) {
        navigate('/dashboard');
        return;
      }

      try {
        // Check if quiz exists
        const quizData = await api.getQuiz(grade, subjectId, chapterId, quizId);
        if (!quizData) {
          navigate('/dashboard');
          return;
        }

        // Check if user has already completed this quiz
        const savedState = localStorage.getItem(`quiz_${quizId}_${user.uid}`);
        if (savedState) {
          const { isComplete } = JSON.parse(savedState);
          if (isComplete) {
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
  }, [quizId, user, grade, subjectId, chapterId, navigate]);
  
  if (loading) {
    return <Loading text="Loading quiz..." fullScreen />;
  }

  if (!isAuthorized || !currentQuiz) {
    return <Loading text="Redirecting..." fullScreen />;
  }
  
  const handleStartQuiz = () => {
    navigate(`/quiz/${grade}/${subjectId}/${chapterId}/${quizId}`);
  };
  
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  const totalQuestions = currentQuiz.questions?.length || 0;
  const timeLimit = currentQuiz.timeLimit || 5;
  
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
          <span className="value">{timeLimit}</span>
          <span className="label">Minutes</span>
        </div>
        <div className="info-item">
          <span className="value">{currentQuiz.difficulty}</span>
          <span className="label">Difficulty</span>
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