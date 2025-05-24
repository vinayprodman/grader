
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RippleButton } from '../components/ui/ripple-button';
import Logo from '../components/Logo';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/login');
  };

  const handleSeeDemo = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 via-purple-400 to-blue-300">
      {/* Header */}
      <header className="p-6 flex items-center justify-between">
        <Logo size="md" />
        <div className="flex gap-4">
          <RippleButton variant="outline" className="text-white border-white hover:bg-white hover:text-purple-500" onClick={() => navigate('/login')}>
            Sign In
          </RippleButton>
        </div>
      </header>

      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center text-center px-6 py-16 text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
          Welcome to Grader
        </h1>
        <p className="text-xl md:text-2xl mb-12 max-w-2xl opacity-90 animate-slide-up">
          The smart, fun, and insightful way to master school lessons.
        </p>
        
        <div className="flex gap-4 mb-20">
          <RippleButton 
            variant="secondary" 
            size="lg" 
            className="bg-white text-purple-500 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-full"
            onClick={handleGetStarted}
          >
            Get Started
          </RippleButton>
          <RippleButton 
            variant="outline" 
            size="lg" 
            className="text-white border-white hover:bg-white hover:text-purple-500 px-8 py-4 text-lg font-semibold rounded-full"
            onClick={handleSeeDemo}
          >
            See Demo
          </RippleButton>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Duolingo-style Quizzes */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Duolingo-style Quizzes</h3>
              <p className="text-gray-600 leading-relaxed">
                Engage with interactive quizzes that make learning fun and addictive. Track your progress with gamified rewards and achievements.
              </p>
            </div>

            {/* Personalized Learning */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-yellow-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">💡</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Personalized Learning</h3>
              <p className="text-gray-600 leading-relaxed">
                AI-powered adaptation that matches your learning style and pace. Get custom recommendations based on your performance.
              </p>
            </div>

            {/* Curriculum Aligned */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-cyan-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Curriculum Aligned</h3>
              <p className="text-gray-600 leading-relaxed">
                Content perfectly aligned with school curriculums. Master exactly what you need to succeed in your classes.
              </p>
            </div>

            {/* Grader Lumina Report */}
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-6">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Grader Lumina™ Report</h3>
              <p className="text-gray-600 leading-relaxed">
                Get comprehensive insights into your learning journey with our AI-powered analytics. Track progress, identify strengths, and focus on areas that need improvement.
              </p>
            </div>
          </div>

          {/* Why Grader Section */}
          <div className="text-center">
            <h2 className="text-4xl font-bold text-purple-500 mb-6">Why Grader?</h2>
            <p className="text-xl text-gray-600 mb-12">
              Because mastering concepts should be joyful, not stressful.
            </p>
            <RippleButton 
              size="lg" 
              className="bg-purple-500 hover:bg-purple-600 text-white px-8 py-4 text-lg font-semibold rounded-full"
              onClick={handleGetStarted}
            >
              Start Learning Today
            </RippleButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
