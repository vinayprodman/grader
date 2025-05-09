import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { QuizProvider, useQuiz } from '../../contexts/QuizContext';
import '../../styles/Quiz.css';

// Helper function to generate random strengths and weaknesses
const generateFeedback = (correctAnswers: number, totalQuestions: number) => {
  const categories = [
    'Science questions',
    'Math calculations',
    'Vocabulary knowledge',
    'Problem-solving skills',
    'Geography locations',
    'History questions',
    'Logical reasoning',
    'Pattern recognition'
  ];
  
  // Randomly pick strengths and weaknesses
  const shuffle = [...categories].sort(() => Math.random() - 0.5);
  
  // More correct answers = more strengths
  const strengthCount = Math.max(1, Math.floor(correctAnswers / 3));
  const weaknessCount = Math.max(1, Math.floor((totalQuestions - correctAnswers) / 3));
  
  const strengths = shuffle.slice(0, strengthCount);
  const weaknesses = shuffle.slice(strengthCount, strengthCount + weaknessCount);
  
  return { strengths, weaknesses };
};

const QuizCompletionContent: React.FC = () => {
  const { 
    correctAnswers, 
    currentQuiz,
    totalQuestions,
    saveQuizResult
  } = useQuiz();
  
  const navigate = useNavigate();
  
  // Generate feedback based on performance
  const { strengths, weaknesses } = generateFeedback(correctAnswers, totalQuestions);
  
  useEffect(() => {
    // Save result if not already saved
    if (currentQuiz) {
      saveQuizResult({
        quizId: currentQuiz.id,
        score: correctAnswers,
        totalQuestions,
        completedAt: new Date().toISOString(),
        strengths,
        weaknesses
      });
    }
  }, []);
  
  const handleTakeAnotherQuiz = () => {
    navigate('/');
  };
  
  const handleViewProgress = () => {
    navigate('/progress');
  };
  
  // Determine badge based on score
  let badge = '🥉'; // Bronze by default
  
  if (correctAnswers >= Math.ceil(totalQuestions * 0.8)) {
    badge = '🥇'; // Gold for 80%+
  } else if (correctAnswers >= Math.ceil(totalQuestions * 0.6)) {
    badge = '🥈'; // Silver for 60%+
  }
  
  return (
    <div className="container completion-screen">
      <div className="trophy-icon">🏆</div>
      <h1>Well Done, Champion!</h1>
      <div className="score-display">
        You got <span id="correct-answers">{correctAnswers}</span> out of {totalQuestions} correct!
      </div>
      
      <div className="feedback-box">
        <h3>Strong Areas:</h3>
        <ul>
          {strengths.map((strength, index) => (
            <li key={index}>{strength}</li>
          ))}
        </ul>
      </div>
      
      <div className="feedback-box">
        <h3>Areas to Improve:</h3>
        <ul>
          {weaknesses.map((weakness, index) => (
            <li key={index}>{weakness}</li>
          ))}
        </ul>
      </div>
      
      <div className="badge">{badge}</div>
      
      <div className="buttons-container">
        <button className="btn" onClick={handleTakeAnotherQuiz}>
          Take Another Quiz
        </button>
        <button className="btn btn-secondary" onClick={handleViewProgress}>
          View My Progress
        </button>
      </div>
    </div>
  );
};

const QuizCompletion: React.FC = () => {
  return (
    <QuizProvider>
      <QuizCompletionContent />
    </QuizProvider>
  );
};

export default QuizCompletion;