import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { QuizProvider } from "./context/QuizContext";
import { useAuth } from "./context/AuthContext";

// Pages
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfileSetup from "./pages/ProfileSetup";
import Dashboard from "./pages/Dashboard";
import ChaptersPage from "./pages/ChaptersPage";
import TestsPage from "./pages/TestsPage";
import TestPage from "./pages/TestPage";
import TestResultsPage from "./pages/TestResultsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route 
      path="/profile-setup" 
      element={
        <ProtectedRoute>
          <ProfileSetup />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/dashboard" 
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/subjects/:subjectId/chapters" 
      element={
        <ProtectedRoute>
          <ChaptersPage />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/subjects/:subjectId/chapters/:chapterId/tests" 
      element={
        <ProtectedRoute>
          <TestsPage />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/tests/:testId" 
      element={
        <ProtectedRoute>
          <TestPage />
        </ProtectedRoute>
      } 
    />
    <Route 
      path="/test-results/:testId" 
      element={
        <ProtectedRoute>
          <TestResultsPage />
        </ProtectedRoute>
      } 
    />
    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <QuizProvider>
            <Toaster />
            <Sonner />
            <AppRoutes />
          </QuizProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
