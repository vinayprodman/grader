
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';
import { RippleButton } from '../components/ui/ripple-button';
import { Input } from '../components/ui/input';

const Index: React.FC = () => {
  const [email, setEmail] = useState('demo@example.com');
  const [password, setPassword] = useState('password');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { signInWithEmail, signUpWithEmail, signInWithGoogle, adminSignIn } = useAuth();
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
    } catch (error) {
      console.error('Authentication error:', error);
      // In demo mode, navigate directly to next step
      navigate(isLogin ? '/dashboard' : '/profile-setup');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Google authentication error:', error);
      // In demo mode, navigate directly to dashboard
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Hero Section */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-purple-600 via-purple-700 to-blue-600 p-8 flex flex-col justify-center items-center text-white animate-fade-in">
          <div className="max-w-md text-center">
            <div className="mb-6 flex justify-center">
              <Logo size="lg" withText={false} />
            </div>
            <h1 className="text-4xl font-bold mb-4">Welcome to Grader</h1>
            <p className="text-xl mb-6">
              The educational platform that helps students track their progress and excel in their studies.
            </p>
            <div className="flex justify-center">
              <div className="w-16 h-1 bg-orange-400 rounded-full"></div>
            </div>
            <p className="mt-6 text-white/80">
              Personalized tests, detailed reports, and parent summaries to boost learning outcomes.
            </p>
          </div>
        </div>

        {/* Auth Section */}
        <div className="w-full md:w-1/2 p-8 flex justify-center items-center animate-slide-up">
          <div className="w-full max-w-md">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {isLogin ? 'Sign in to your account' : 'Create your account'}
              </h2>
              <p className="text-gray-600">
                {isLogin 
                  ? 'Enter your credentials to access your dashboard'
                  : 'Fill out the form to get started with Grader'}
              </p>
            </div>

            <form onSubmit={handleAuth} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="demo@example.com"
                  required
                  className="w-full"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full"
                />
              </div>

              <RippleButton
                type="submit" 
                variant="primary" 
                className="w-full bg-purple-600 hover:bg-purple-700" 
                disabled={loading}
              >
                {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Sign Up'}
              </RippleButton>
            </form>

            <div className="my-4 flex items-center">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-2 text-gray-500 text-sm">OR</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            <RippleButton
              type="button" 
              variant="outline" 
              className="w-full mb-3"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg className="w-5 h-5 mr-2 inline" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                />
              </svg>
              Continue with Google
            </RippleButton>

            <RippleButton
              type="button" 
              variant="secondary" 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white"
              onClick={handleDemoLogin}
              disabled={loading}
            >
              Quick Demo (Skip Login)
            </RippleButton>

            <div className="mt-6 text-center">
              <button 
                type="button"
                className="text-purple-600 hover:underline focus:outline-none"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin 
                  ? "Don't have an account? Sign up" 
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
