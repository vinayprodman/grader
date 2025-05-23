import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/PerformanceSummary.css';
import { Trophy } from 'lucide-react'; // Import Trophy icon

const PerformanceSummary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { score, time } = location.state || {};

  // Format time in mm:ss
  const formatTime = (ms: number) => {
    if (!ms) return '00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Determine feedback message based on score (similar to QuizScreen example)
  const feedbackMessage = (score: number | undefined, totalQuestions: number) => {
    if (score === undefined) return "";
    const percentage = (score / totalQuestions) * 100;
    if (percentage === 100) return "Perfect! You're a quiz master! 🏆";
    if (percentage >= 80) return "Excellent work! You really know your stuff! 🌟";
    if (percentage >= 60) return "Good job! Keep learning and improving! 👍";
    return "Keep practicing, you'll get better! 💪";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl text-center">

        {/* Performance Summary Card (similar to Question Card) */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-8 border border-white/20">
          <div className="mb-6">
            {/* Trophy Icon */}
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white mb-4">
                <Trophy className="w-10 h-10" />
              </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Summary</h1>
            <p className="text-lg text-gray-600">Your Performance</p>
          </div>

          {/* Stats Grid (similar to the one in QuizScreen result) */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="stat-item bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <div className="stat-label text-sm text-gray-500 font-medium">Score</div>
              <div className="stat-value text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                {score !== undefined ? `${score.toFixed(0)}%` : '--'}{/* Assuming score is percentage directly */}
              </div>
            </div>
            <div className="stat-item bg-white rounded-xl p-4 shadow-md border border-gray-100">
              <div className="stat-label text-sm text-gray-500 font-medium">Time Taken</div>
              <div className="stat-value text-2xl font-bold text-gray-800">
                {formatTime(time)}
              </div>
            </div>
             {/* Add more stats here if available, e.g., Correct Answers */}
             {/* For example: */}
             {/* <div className="stat-item bg-white rounded-xl p-4 shadow-md border border-gray-100">
               <div className="stat-label text-sm text-gray-500 font-medium">Correct</div>
               <div className="stat-value text-2xl font-bold text-emerald-600">{correctAnswers}</div>
             </div> */}
          </div>

           {/* Progress Bar (similar to QuizScreen result) */}
            {score !== undefined && (
              <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden mb-8">
                <div 
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-1000 ease-out rounded-full"
                  style={{ width: `${score}%` }} // Assuming score is percentage
                />
              </div>
            )}

           {/* Feedback Message (similar to QuizScreen result) */}
            <p className="text-lg text-gray-700 mb-8">
               {feedbackMessage(score, 100)}{/* Assuming score is out of 100 for feedback */}
            </p>

          {/* Action Buttons */}
          <div className="flex flex-col items-center space-y-4">
             {/* Return to Dashboard Button */}
             <button
               onClick={() => navigate('/dashboard')}
               className="inline-flex items-center px-8 py-4 rounded-2xl font-bold text-lg bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-2xl hover:scale-105 transition-all duration-300 hover:shadow-purple-500/25"
             >
              Return to Dashboard
             </button>
             {/* Optionally add a 'Take Quiz Again' button if applicable */}
             {/* <button
               onClick={handleRestart}
               className="inline-flex items-center px-8 py-4 rounded-2xl font-bold text-lg bg-gray-200 text-gray-800 shadow-lg hover:scale-105 transition-all duration-300 hover:shadow-gray-300/50"
             >
               <RotateCcw className="mr-2 w-5 h-5" />
               Take Quiz Again
             </button> */}
          </div>
        </div>

      </div>
    </div>
  );
};

export default PerformanceSummary; 