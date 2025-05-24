import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { updateProfile } from 'firebase/auth';

const ProfileSetup: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: auth.currentUser?.displayName || '',
    grade: '',
    age: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const ageNum = parseInt(formData.age);
      if (isNaN(ageNum) || ageNum < 5 || ageNum > 18) {
        throw new Error('Please enter a valid age between 5 and 18');
      }

      await updateProfile(auth.currentUser!, {
        displayName: formData.name
      });

      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Profile Setup</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Grade"
          value={formData.grade}
          onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
        />
        <input
          type="text"
          placeholder="Age"
          value={formData.age}
          onChange={(e) => setFormData({ ...formData, age: e.target.value })}
        />
        {error && <p>{error}</p>}
        <button type="submit" disabled={loading}>Submit</button>
      </form>
    </div>
  );
};

export default ProfileSetup;
