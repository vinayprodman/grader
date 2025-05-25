import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../lib/firebase";
import { useAuth } from '../components/context/AuthContext';
import Logo from '../components/Logo';
import { RippleButton } from '../components/ui/ripple-button';
import { Input } from '../components/ui/input';
import { useToast } from '../components/ui/use-toast';

const SignupPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp, signInWithGoogle } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (auth.currentUser) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signUp(email, password, { name: email.split('@')[0] });
      toast({
        title: "Success",
        description: "Account created successfully! Please complete your profile.",
      });
      navigate('/profile-setup');
    } catch (err) {
      setError("Failed to sign up. Please try again.");
      toast({
        title: "Error",
        description: "Failed to create account. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await signInWithGoogle();
      toast({
        title: "Success",
        description: "Successfully signed in with Google!",
      });
      navigate('/dashboard');
    } catch (err) {
      setError("Failed to sign up with Google.");
      toast({
        title: "Error",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Hero Section */}
        <div className="w-full md:w-1/2 bg-gradient-to-br from-purple-300 via-purple-400 to-blue-300 p-8 flex flex-col justify-center items-center text-white animate-fade-in">
          <div className="max-w-md text-center">
            <div className="mb-6 flex justify-center">
              <Logo size="lg" withText={false} />
            </div>
            <h1 className="text-4xl font-bold mb-4">Join Grader</h1>
            <p className="text-xl mb-6">
              Start your personalized learning journey with interactive tests and detailed progress tracking.
            </p>
            <div className="flex justify-center">
              <div className="w-16 h-1 bg-orange-300 rounded-full"></div>
            </div>
            <p className="mt-6 text-white/80">
              Create your account and unlock the full potential of personalized learning.
            </p>
          </div>
        </div>

        {/* Auth Section */}
        <div className="w-full md:w-1/2 p-8 flex justify-center items-center animate-slide-up">
          <div className="w-full max-w-md">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Create your account
              </h2>
              <p className="text-gray-600">
                Fill out the form to get started with Grader
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
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
                  placeholder="Enter your password"
                  required
                  minLength={6}
                  className="w-full"
                />
              </div>

              <RippleButton
                type="submit" 
                variant="primary" 
                className="w-full bg-purple-400 hover:bg-purple-500" 
                disabled={isLoading}
              >
                {isLoading ? 'Creating account...' : 'Sign Up'}
              </RippleButton>
            </form>

            <div className="mt-6 text-center">
              <span className="text-gray-500">or</span>
            </div>

            <RippleButton
              type="button"
              variant="outline"
              className="w-full mt-4 flex items-center justify-center gap-2"
              onClick={handleGoogleSignUp}
              disabled={isLoading}
            >
              <svg width="24" height="24" viewBox="0 0 48 48">
                <clipPath id="g">
                  <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" />
                </clipPath>
                <g className="colors" clipPath="url(#g)">
                  <path fill="#FBBC05" d="M0 37V11l17 13z" />
                  <path fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" />
                  <path fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z" />
                  <path fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" />
                </g>
              </svg>
              Sign up with Google
            </RippleButton>

            <div className="mt-6 text-center">
              <button 
                type="button"
                className="text-purple-500 hover:underline focus:outline-none"
                onClick={() => navigate('/login')}
              >
                Already have an account? Sign in
              </button>
            </div>

            {error && <p className="mt-4 text-red-500 text-center">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
