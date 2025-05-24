
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useFirestore } from '../hooks/useFirestore';
import { usePerformance } from '../hooks/usePerformance';
import { RippleButton } from '../components/ui/ripple-button';
import { useTimer } from '../hooks/useTimer';
import Logo from '../components/Logo';
import { useToast } from '../hooks/use-toast';

interface Question {
  id: string;
  text: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  explanation: string;
}

const TestPage: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getQuestions } = useFirestore();
  const { addTestResult } = usePerformance();
  const { toast } = useToast();
  
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Timer for 15 minutes (15 * 60 seconds)
  const { timeRemaining, formattedRemaining, start, pause } = useTimer(15, true);
  
  useEffect(() => {
    const loadQuestions = async () => {
      if (testId) {
        const questionData = await getQuestions(testId);
        setQuestions(questionData);
        setLoading(false);
      }
    };
    
    loadQuestions();
  }, [testId, getQuestions]);
  
  useEffect(() => {
    // Auto-submit when time runs out
    if (timeRemaining === 0 && !isSubmitted) {
      handleSubmitTest();
    }
  }, [timeRemaining, isSubmitted]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleNextQuestion = () => {
    if (selectedOption) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: selectedOption
      }));
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedOption(answers[questions[currentQuestionIndex + 1]?.id] || '');
      } else {
        handleSubmitTest();
      }
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setSelectedOption(answers[questions[currentQuestionIndex - 1]?.id] || '');
    }
  };

  const handleSubmitTest = () => {
    // Save current answer if any
    const finalAnswers = selectedOption 
      ? { ...answers, [currentQuestion.id]: selectedOption }
      : answers;

    // Calculate score
    let correctCount = 0;
    const detailedResults = questions.map(question => {
      const userAnswer = finalAnswers[question.id];
      const isCorrect = userAnswer === question.correctOptionId;
      if (isCorrect) correctCount++;
      
      return {
        questionId: question.id,
        question: question.text,
        userAnswer,
        correctAnswer: question.correctOptionId,
        isCorrect,
        explanation: question.explanation,
        options: question.options
      };
    });

    const score = Math.round((correctCount / questions.length) * 100);
    const timeSpent = (15 * 60) - timeRemaining;
    
    // Extract subject from testId
    const subjectId = testId?.split('-')[0] || 'math';
    
    // Add to performance tracking
    addTestResult({
      testId: testId || 'test-1',
      score,
      timeSpent,
      subjectId
    });
    
    // Store results in localStorage for demo
    const testResult = {
      testId: testId || 'test-1',
      score,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      results: detailedResults,
      completedAt: new Date().toISOString(),
      timeSpent
    };
    
    localStorage.setItem('lastTestResult', JSON.stringify(testResult));
    
    pause();
    setIsSubmitted(true);
    
    toast({
      title: "Test Completed!",
      description: `You scored ${score}% (${correctCount}/${questions.length})`,
    });

    // Navigate to results page
    navigate(`/test-results/${testId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Loading test...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p>No questions available for this test.</p>
          <RippleButton onClick={() => navigate('/dashboard')} className="mt-4">
            Back to Dashboard
          </RippleButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <Logo size="sm" />
          <h1 className="text-xl font-bold ml-4">Test {testId?.split('-')[1] || '1'}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
          <div className="bg-amber-100 text-amber-800 px-3 py-1 rounded-md text-sm font-medium">
            Time: {formattedRemaining}
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white px-6 py-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question Content */}
      <div className="flex-1 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8 animate-fade-in">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {currentQuestion.text}
            </h2>
            
            <div className="space-y-4">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleOptionSelect(option.id)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedOption === option.id
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center">
                    <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                      selectedOption === option.id
                        ? 'border-purple-500 bg-purple-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedOption === option.id && (
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      )}
                    </div>
                    <span className="text-lg">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <RippleButton
                variant="outline"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
              >
                Previous
              </RippleButton>
              
              <div className="space-x-4">
                <RippleButton
                  variant="secondary"
                  onClick={handleSubmitTest}
                >
                  Submit Test
                </RippleButton>
                
                <RippleButton
                  variant="default"
                  onClick={handleNextQuestion}
                  disabled={!selectedOption}
                >
                  {currentQuestionIndex === questions.length - 1 ? 'Finish' : 'Next'}
                </RippleButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
