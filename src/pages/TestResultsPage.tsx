
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RippleButton } from '../components/ui/ripple-button';
import Logo from '../components/Logo';
import { Check, X, Trophy, Clock, Target } from 'lucide-react';

interface TestResult {
  testId: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  completedAt: string;
  timeSpent: number;
  results: Array<{
    questionId: string;
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
    options: Array<{ id: string; text: string }>;
  }>;
}

const TestResultsPage: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const [result, setResult] = useState<TestResult | null>(null);

  useEffect(() => {
    // Load result from localStorage (in a real app, this would come from the database)
    const storedResult = localStorage.getItem('lastTestResult');
    if (storedResult) {
      setResult(JSON.parse(storedResult));
    }
  }, []);

  if (!result) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-grader-green mx-auto mb-4"></div>
          <p>Loading results...</p>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number) => {
    if (score >= 90) return { text: 'Excellent!', color: 'bg-green-500' };
    if (score >= 80) return { text: 'Great Job!', color: 'bg-blue-500' };
    if (score >= 70) return { text: 'Good Work!', color: 'bg-yellow-500' };
    if (score >= 60) return { text: 'Keep Practicing!', color: 'bg-orange-500' };
    return { text: 'Needs Improvement', color: 'bg-red-500' };
  };

  const badge = getScoreBadge(result.score);
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <Logo size="sm" />
          <h1 className="text-xl font-bold ml-4">Test Results</h1>
        </div>
        <RippleButton
          variant="outline"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </RippleButton>
      </header>

      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Score Summary */}
          <div className="bg-white rounded-lg shadow-md p-8 text-center animate-fade-in">
            <div className="mb-6">
              <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Test Complete!</h2>
              <div className={`inline-block px-4 py-2 rounded-full text-white text-lg font-medium ${badge.color}`}>
                {badge.text}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className={`text-4xl font-bold mb-2 ${getScoreColor(result.score)}`}>
                  {result.score}%
                </div>
                <div className="text-gray-600 flex items-center justify-center">
                  <Target className="w-4 h-4 mr-1" />
                  Overall Score
                </div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-800 mb-2">
                  {result.correctAnswers}/{result.totalQuestions}
                </div>
                <div className="text-gray-600">Correct Answers</div>
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-800 mb-2">
                  {formatTime(result.timeSpent)}
                </div>
                <div className="text-gray-600 flex items-center justify-center">
                  <Clock className="w-4 h-4 mr-1" />
                  Time Taken
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Results */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-6">Question Analysis</h3>
            
            <div className="space-y-6">
              {result.results.map((item, index) => (
                <div key={item.questionId} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-800 flex-1">
                      {index + 1}. {item.question}
                    </h4>
                    <div className={`ml-4 p-2 rounded-full ${item.isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                      {item.isCorrect ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <X className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm font-medium text-gray-600 mb-1">Your Answer:</div>
                      <div className={`p-2 rounded ${item.isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                        {item.options.find(opt => opt.id === item.userAnswer)?.text || 'Not answered'}
                      </div>
                    </div>
                    
                    {!item.isCorrect && (
                      <div>
                        <div className="text-sm font-medium text-gray-600 mb-1">Correct Answer:</div>
                        <div className="p-2 rounded bg-green-50 text-green-800">
                          {item.options.find(opt => opt.id === item.correctAnswer)?.text}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-blue-50 p-3 rounded">
                    <div className="text-sm font-medium text-blue-800 mb-1">Explanation:</div>
                    <div className="text-blue-700">{item.explanation}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <RippleButton
              variant="outline"
              onClick={() => navigate('/dashboard')}
            >
              Back to Dashboard
            </RippleButton>
            <RippleButton
              variant="primary"
              onClick={() => navigate(`/tests/${testId}`)}
            >
              Retake Test
            </RippleButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestResultsPage;
