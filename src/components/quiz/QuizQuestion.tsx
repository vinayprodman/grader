import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { QuizProvider, useQuiz, QuizQuestion as QuestionType } from '../../contexts/QuizContext';
import '../../styles/Quiz.css';

// Popup component
const MidQuizPopup: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  useEffect(() => {
    // Auto-close after 2 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [onClose]);
  
  return (
    <div className="popup-container">
      <div className="overlay"></div>
      <div className="popup">
        <h3>Halfway there! 🚀</h3>
        <p>Keep Going! You're doing great!</p>
        <button className="popup-btn" onClick={onClose}>Continue</button>
      </div>
    </div>
  );
};

// Animation component
const AnswerAnimation: React.FC<{
  emoji: string;
  explanation: string;
  onComplete: () => void;
}> = ({ emoji, explanation, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);
  
  return (
    <div className="animation-container animation-visible">
      <div className="animation-emoji">{emoji}</div>
      <div className="explanation-text">{explanation}</div>
      <div className="countdown-container">
        <div id="countdown-bar" className="countdown-bar"></div>
      </div>
      <div className="countdown-numbers">
        {[1, 2, 3, 4, 5].map(num => (
          <div 
            key={num} 
            id={`countdown-dot-${num}`} 
            className={`countdown-dot ${num === 1 ? 'active' : ''}`}
          ></div>
        ))}
      </div>
    </div>
  );
};

const QuizQuestionContent: React.FC = () => {
  const { 
    currentQuestion, 
    correctAnswers,
    showAnimation,
    setShowAnimation,
    animationData,
    selectOption,
    currentQuiz,
    totalQuestions
  } = useQuiz();
  
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [currentQuestionData, setCurrentQuestionData] = useState<QuestionType | null>(null);
  
  const navigate = useNavigate();
  const { quizId } = useParams<{ quizId: string }>();
  
  useEffect(() => {
    // Show popup at halfway point
    if (currentQuestion === Math.ceil(totalQuestions / 2)) {
      setShowPopup(true);
    }
    
    // Reset selected option when question changes
    setSelectedOptionIndex(null);
    setIsCorrect(null);
    
    // Update current question data
    if (currentQuiz?.questions && currentQuiz.questions.length >= currentQuestion) {
      setCurrentQuestionData(currentQuiz.questions[currentQuestion - 1]);
    }
  }, [currentQuestion, totalQuestions, currentQuiz]);
  
  const handleOptionSelect = (optionIndex: number) => {
    if (selectedOptionIndex !== null) return; // Prevent multiple selections
    
    setSelectedOptionIndex(optionIndex);
    
    if (currentQuestionData) {
      const correct = optionIndex === currentQuestionData.answer_key;
      setIsCorrect(correct);
      selectOption(optionIndex, correct, currentQuestionData);
    }
  };
  
  const handleFinishQuiz = () => {
    navigate(`/quiz/${quizId}/completion`);
  };
  
  if (!currentQuestionData) {
    return <div>Loading question...</div>;
  }
  
  return (
    <div className="container question-screen">
      <div className="question-count">
        Question <span id="current-question">{currentQuestion}</span> of {totalQuestions}
      </div>
      
      <div className="progress-container">
        <div 
          className="progress-bar" 
          style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
        ></div>
      </div>
      
      <div className="question-text">
        {currentQuestionData.question}
      </div>
      
      <div className="options-container">
        {Object.entries(currentQuestionData.options).map(([key, option]) => {
          const optionIndex = parseInt(key);
          const isSelected = selectedOptionIndex === optionIndex;
          let optionClass = "option";
          
          if (isSelected) {
            optionClass += isCorrect ? " correct" : " incorrect";
          } else if (selectedOptionIndex !== null && optionIndex === currentQuestionData.answer_key) {
            // Highlight correct answer if user selected wrong
            optionClass += " correct";
          }
          
          return (
            <div 
              key={key} 
              className={optionClass}
              onClick={() => handleOptionSelect(optionIndex)}
            >
              <div className="option-prefix">
                {String.fromCharCode(65 + optionIndex)}
              </div>
              <div className="option-text">{option}</div>
            </div>
          );
        })}
      </div>
      
      {showAnimation && (
        <AnswerAnimation 
          emoji={animationData.emoji}
          explanation={animationData.explanation}
          onComplete={() => setShowAnimation(false)}
        />
      )}
      
      {currentQuestion === totalQuestions && selectedOptionIndex !== null && (
        <button 
          id="finish-button" 
          className="btn"
          onClick={handleFinishQuiz}
        >
          Finish Quiz
        </button>
      )}
      
      {showPopup && (
        <MidQuizPopup onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
};

const QuizQuestion: React.FC = () => {
  return (
    <QuizProvider>
      <QuizQuestionContent />
    </QuizProvider>
  );
};

export default QuizQuestion;