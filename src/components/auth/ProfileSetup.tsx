import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './ProfileSetup.css';

const ProfileSetup: React.FC = () => {
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [grade, setGrade] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { updateUserProfile } = useAuth();

  const validateInputs = () => {
    const ageNum = parseInt(age, 10);
    if (isNaN(ageNum) || ageNum < 5 || ageNum > 18) {
      setError("Please enter a valid age between 5 and 18");
      return false;
    }
    if (!grade.trim()) {
      setError("Please enter your grade");
      return false;
    }
    if (!name.trim()) {
      setError("Please enter your name");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validateInputs()) return;

    try {
      setLoading(true);
      await updateUserProfile({
        name,
        age: parseInt(age, 10),
        grade,
        createdAt: new Date().toISOString()
      });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || "Failed to create profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-setup-container">
      <div className="profile-setup-card animate-slide-up">
        <div className="profile-setup-header">
          <div className="app-logo">📚</div>
          <h1 className="app-title">Grader</h1>
          <p className="app-subtitle">Tell us about yourself</p>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="form-group">
            <label className="form-label" htmlFor="name">Your Name</label>
            <input
              type="text"
              id="name"
              className="form-control"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError(null);
              }}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="age">Age</label>
            <input
              type="number"
              id="age"
              className="form-control"
              placeholder="Enter your age"
              value={age}
              onChange={(e) => {
                setAge(e.target.value);
                setError(null);
              }}
              min="5"
              max="18"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="grade">Grade</label>
            <select
              id="grade"
              className="form-control"
              value={grade}
              onChange={(e) => {
                setGrade(e.target.value);
                setError(null);
              }}
              required
              disabled={loading}
            >
              <option value="">Select Grade</option>
              <option value="1">Grade 1</option>
              <option value="2">Grade 2</option>
              <option value="3">Grade 3</option>
              <option value="4">Grade 4</option>
              <option value="5">Grade 5</option>
              <option value="6">Grade 6</option>
              <option value="7">Grade 7</option>
              <option value="8">Grade 8</option>
            </select>
          </div>

          <button
            type="submit"
            className={`btn btn-primary btn-block ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Creating Profile...' : 'Create Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup; 