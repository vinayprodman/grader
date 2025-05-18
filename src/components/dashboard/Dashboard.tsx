import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen, User, LogOut, Award } from 'lucide-react';
import { Subject } from '../../types/education';
import { getSubjectInfo } from '../../utils/dataLoader.tsx';
import { progressService } from '../../services/progressService';
import Loading from '../common/Loading';
import '../../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({
    overallProgress: 0,
    timeSpent: 0,
    averageScore: 0
  });

  // Set the total number of quizzes available (hardcoded for now)
  const totalQuizzesAvailable = 15; // 5 quizzes * 3 subjects

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        if (!user?.uid) return;

        console.log('Loading dashboard for user:', user.uid);
        
        // Start new session
        await progressService.startSession(user.uid);

        // Load subjects
        const grade = user?.profile?.grade || '1';
        const subjectIds = ['math', 'science', 'english'];
        const subjectsData = subjectIds.map(subjectId => getSubjectInfo(subjectId, grade));
        setSubjects(subjectsData);

        // Load progress
        const userProgress = await progressService.getUserProgress(user.uid);
        if (userProgress) {
          const { overallProgress, timeSpent, averageScore } = progressService.calculateProgress(userProgress);
          setProgress({ overallProgress, timeSpent, averageScore });
        }
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user?.uid, user?.profile?.grade]);

  // Handle session cleanup
  useEffect(() => {
    if (!user?.uid) return;

    console.log('Setting up session handlers for user:', user.uid);

    const handleBeforeUnload = async (e: BeforeUnloadEvent) => {
      console.log('Before unload event triggered');
      try {
        await progressService.endSession(user.uid);
      } catch (error) {
        console.error('Error in beforeunload handler:', error);
      }
    };

    const handleVisibilityChange = async () => {
      console.log('Visibility changed:', document.visibilityState);
      try {
        if (document.visibilityState === 'hidden') {
          await progressService.endSession(user.uid);
        } else {
          await progressService.startSession(user.uid);
          // Reload progress when tab becomes visible again
          const userProgress = await progressService.getUserProgress(user.uid);
          if (userProgress) {
            const { overallProgress, timeSpent, averageScore } = progressService.calculateProgress(userProgress);
            setProgress({ overallProgress, timeSpent, averageScore });
          }
        }
      } catch (error) {
        console.error('Error in visibility change handler:', error);
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      console.log('Cleaning up session handlers');
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      progressService.endSession(user.uid).catch(console.error);
    };
  }, [user?.uid]);

  // Track time spent
  useEffect(() => {
    if (!user?.uid) return;

    let startTime = Date.now();
    const updateInterval = setInterval(async () => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000); // Convert to seconds
      try {
        await progressService.updateTimeSpent(user.uid, timeSpent);
        // Update local state with the latest progress
        const userProgress = await progressService.getUserProgress(user.uid);
        if (userProgress) {
          const { overallProgress, timeSpent, averageScore } = progressService.calculateProgress(userProgress);
          setProgress({ overallProgress, timeSpent, averageScore });
        }
        startTime = Date.now(); // Reset start time after update
      } catch (error) {
        console.error('Error updating time spent:', error);
      }
    }, 60000); // Update every minute

    return () => {
      clearInterval(updateInterval);
      // Update final time spent when component unmounts
      if (user?.uid) {
        const finalTimeSpent = Math.floor((Date.now() - startTime) / 1000);
        progressService.updateTimeSpent(user.uid, finalTimeSpent).catch(console.error);
      }
    };
  }, [user?.uid]);

  const handleSubjectClick = (subjectId: string) => {
    const grade = user?.profile?.grade || '1';
    navigate(`/subjects/${grade}/${subjectId}`);
  };

  const handleProfileSetup = () => {
    navigate('/profile-setup');
  };

  const handleSignOut = async () => {
    try {
      console.log('Signing out user:', user?.uid);
      if (user?.uid) {
        await progressService.endSession(user.uid);
      }
      await logout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return <Loading text="Loading dashboard..." fullScreen />;
  }

  const formatTimeSpent = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="logo">
          <BookOpen size={32} color="#4a6ee0" />
          <h1>grader</h1>
        </div>
        <div className="user-actions">
          {!user?.profile && (
            <button 
              className="btn btn-secondary"
              onClick={handleProfileSetup}
            >
              <User size={20} />
              Complete Profile
            </button>
          )}
          <button 
            className="btn btn-ghost"
            onClick={handleSignOut}
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </div>

      <div className="welcome-banner">
        <h2>Welcome back, {user?.profile?.name || user?.displayName || 'User'}! 👋</h2>
        <p>Ready to continue your learning journey?</p>
      </div>

      <div className="progress-overview">
        <div className="progress-card">
          <h3>Overall Progress</h3>
          <div className="progress-value">{progress.overallProgress}%</div>
          <div className="progress-label">Completed quizzes: {user?.uid ? progress.quizCount || 0 : 0} / {totalQuizzesAvailable}</div>
        </div>
        <div className="progress-card">
          <h3>Average Score</h3>
          <div className="progress-value">{progress.averageScore}%</div>
          <div className="progress-label">Across all completed tests</div>
        </div>
        <div className="progress-card">
          <h3>Time Spent</h3>
          <div className="progress-value">{formatTimeSpent(progress.timeSpent)}</div>
          <div className="progress-label">Total learning time this week</div>
        </div>
      </div>

      <div className="subjects-grid">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="subject-card"
            onClick={() => handleSubjectClick(subject.id)}
          >
            <div className="subject-icon">
              {subject.icon}
            </div>
            <div className="subject-content">
              <h3>{subject.title}</h3>
              <p>{subject.description}</p>
              <div className="subject-meta">
                <span className="chapter-count">
                  <BookOpen size={16} />
                  5 chapters
                </span>
                <span className="grade-level">
                  <Award size={16} />
                  Grade {subject.grade}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;