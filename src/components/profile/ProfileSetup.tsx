import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../common/Loading';
import '../../styles/ProfileSetup.css';

const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    grade: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save profile data to localStorage
      localStorage.setItem('childProfile', JSON.stringify(formData));
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="profile-setup">
      <div className="profile-setup-container">
        <div className="profile-setup-content">
          <h1>Complete Your Profile</h1>
          <p>Tell us a bit about yourself to get started</p>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="child-name">Name</label>
              <input
                type="text"
                id="child-name"
                name="name"
                className="form-control"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="child-age">Age</label>
              <input
                type="number"
                id="child-age"
                name="age"
                className="form-control"
                value={formData.age}
                onChange={handleChange}
                min="5"
                max="18"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label" htmlFor="child-grade">Grade</label>
              <select
                id="child-grade"
                name="grade"
                className="form-control"
                value={formData.grade}
                onChange={handleChange}
                required
              >
                <option value="">Select Grade</option>
                {[...Array(8)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    Grade {i + 1}
                  </option>
                ))}
              </select>
            </div>
            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loading text="Creating Profile..." />
              ) : (
                'Create Profile'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup; 