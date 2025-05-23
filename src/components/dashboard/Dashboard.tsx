import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen, User, LogOut, Award, ChevronRight, TrendingUp, Target, Clock } from 'lucide-react';
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
  // const totalQuizzesAvailable = 15; // 5 quizzes * 3 subjects -- removing as it's not used currently in stats display

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        if (!user?.uid) return;

        console.log('Loading dashboard for user:', user.uid);
        
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

      <div className="stats-pods-container">
        <div className="stat-pod">
          <div className="stat-pod-icon"><TrendingUp size={22} /></div>
          <div className="stat-pod-content">
            <span className="stat-label">Overall Progress</span>
            <span className="stat-value">{progress.overallProgress}%</span>
          </div>
        </div>
        <div className="stat-pod">
          <div className="stat-pod-icon"><Target size={22} /></div>
          <div className="stat-pod-content">
            <span className="stat-label">Average Score</span>
            <span className="stat-value">{progress.averageScore}%</span>
          </div>
        </div>
        <div className="stat-pod">
          <div className="stat-pod-icon"><Clock size={22} /></div>
          <div className="stat-pod-content">
            <span className="stat-label">Time Spent</span>
            <span className="stat-value">{formatTimeSpent(progress.timeSpent)}</span>
          </div>
        </div>
      </div>

      <div className="subjects-grid">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="subject-card"
            style={{ backgroundColor: subject.color }}
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
            <ChevronRight size={24} className="subject-arrow-icon" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;