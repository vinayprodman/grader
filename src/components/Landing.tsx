import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Sparkles, Users, LineChart } from 'lucide-react';
import '../styles/Landing.css';

const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="gradient-bg min-h-[80vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Welcome to Grader
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-10 max-w-2xl mx-auto">
            The smart, fun, and insightful way to master school lessons.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="btn btn-secondary px-8 py-4 rounded-full font-semibold text-lg shadow-lg"
              onClick={() => navigate('/login')}
            >
              Get Started
            </button>
            <button className="btn btn-primary px-8 py-4 rounded-full font-semibold text-lg shadow-lg">
              See Demo
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Feature 1 */}
            <div className="card rounded-2xl p-8 shadow-lg hover:shadow-xl">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg mb-6" style={{ backgroundColor: '#FFE1DE' }}>
                <Sparkles size={28} className="icon-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-violet">Duolingo-style Quizzes</h3>
              <p className="text-secondary">Engage with interactive quizzes that make learning fun and addictive. Track your progress with gamified rewards and achievements.</p>
            </div>

            {/* Feature 2 */}
            <div className="card rounded-2xl p-8 shadow-lg hover:shadow-xl">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg mb-6" style={{ backgroundColor: '#FFF2C6' }}>
                <Users size={28} className="progress-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-violet">Personalized Learning</h3>
              <p className="text-secondary">AI-powered adaptation that matches your learning style and pace. Get custom recommendations based on your performance.</p>
            </div>

            {/* Feature 3 */}
            <div className="card rounded-2xl p-8 shadow-lg hover:shadow-xl">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg mb-6" style={{ backgroundColor: '#D9F6F9' }}>
                <BookOpen size={28} className="link-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-violet">Curriculum Aligned</h3>
              <p className="text-secondary">Content perfectly aligned with school curriculums. Master exactly what you need to succeed in your classes.</p>
            </div>

            {/* Feature 4 */}
            <div className="card rounded-2xl p-8 shadow-lg hover:shadow-xl">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg mb-6" style={{ backgroundColor: '#E8E6FF' }}>
                <LineChart size={28} className="text-violet" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-violet">Grader Lumina™ Report</h3>
              <p className="text-secondary">Get comprehensive insights into your learning journey with our AI-powered analytics. Track progress, identify strengths, and focus on areas that need improvement.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Grader Section */}
      <section className="py-20 px-4 bg-gradient-to-b">
        <div className="max-w-4xl mx-auto rounded-3xl p-8 md:p-16 text-center shadow-xl bg-lavender">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-violet">Why Grader?</h2>
          <p className="text-xl text-secondary mb-10 max-w-2xl mx-auto">
            Because mastering concepts should be joyful, not stressful.
          </p>
          <button 
            className="btn btn-primary px-8 py-4 rounded-full font-semibold text-lg shadow-lg bg-gradient-to-r"
            onClick={() => navigate('/login')}
          >
            Join the Grader Journey
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-lavender">
        <div className="max-w-6xl mx-auto text-center text-secondary">
          <p>&copy; 2024 Grader. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing; 