
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { RippleButton } from "../components/ui/ripple-button";
import Logo from "../components/Logo";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="text-center max-w-md animate-fade-in">
        <div className="mb-8 flex justify-center">
          <Logo size="md" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-gray-800">404</h1>
        <p className="text-xl text-gray-600 mb-8">Oops! We couldn't find the page you're looking for.</p>
        <p className="text-gray-500 mb-8">The page might have been moved or doesn't exist.</p>
        <a href="/">
          <RippleButton variant="primary" className="bg-purple-600 hover:bg-purple-700">
            Return to Home
          </RippleButton>
        </a>
      </div>
    </div>
  );
};

export default NotFound;
