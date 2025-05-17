import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { QuizProvider } from './contexts/QuizContext';
import Landing from './components/Landing';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import Dashboard from './components/dashboard/Dashboard';
import ProfileSetup from './components/auth/ProfileSetup';
import SubjectDetail from './components/subjects/SubjectDetail';
import ChapterDetail from './components/chapters/ChapterDetail.tsx';
import QuizTest from './components/quiz/QuizTest';
import QuizResults from './components/quiz/QuizResults';
import PerformanceSummary from './components/PerformanceSummary';
import './App.css';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Preserve the attempted URL for redirecting back after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <QuizProvider>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes */}
          <Route
            path="/grader"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile-setup"
            element={
              <ProtectedRoute>
                <ProfileSetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/grader/subjects/:grade/:subjectId"
            element={
              <ProtectedRoute>
                <SubjectDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/grader/chapter/:grade/:subjectId/:chapterId"
            element={
              <ProtectedRoute>
                <ChapterDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/grader/quiz/:grade/:subjectId/:chapterId/:quizId"
            element={
              <ProtectedRoute>
                <QuizTest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/grader/quiz-results/:quizId"
            element={
              <ProtectedRoute>
                <QuizResults />
              </ProtectedRoute>
            }
          />
          <Route
            path="/grader/performance"
            element={
              <ProtectedRoute>
                <PerformanceSummary />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </QuizProvider>
    </AuthProvider>
  );
};

export default App;