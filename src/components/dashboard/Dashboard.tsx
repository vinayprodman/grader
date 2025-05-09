import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { BookOpen, User, LogOut } from 'lucide-react';
import { Subject, getSubjects } from '../../data/mockData';
import '../../styles/Dashboard.css';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const data = await getSubjects();
        setSubjects(data);
      } catch (error) {
        console.error('Error loading subjects:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSubjects();
  }, []);

  const handleSubjectClick = (subjectId: string) => {
    navigate(`/subjects/${subjectId}`);
  };

  const handleProfileSetup = () => {
    navigate('/profile-setup');
  };

  const handleSignOut = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

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
        <p>Choose a subject to continue your learning journey</p>
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
                  {subject.chapters.length} chapters
                </span>
                <span className="grade-level">
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