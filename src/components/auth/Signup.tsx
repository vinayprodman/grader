import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import graderLogo from '../../assets/grader_logo.png';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState<number | ''>('');
  const [grade, setGrade] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, googleSignIn } = useAuth();
  const navigate = useNavigate();
  
  const gradeOptions = [
    'Kindergarten',
    '1st Grade',
    '2nd Grade',
    '3rd Grade',
    '4th Grade',
    '5th Grade',
    '6th Grade',
    '7th Grade',
    '8th Grade'
  ];
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || age === '' || !grade) {
      setError('Please fill in all fields');
      return;
    }
    try {
      setError('');
      setIsLoading(true);
      await register(email, password, name, age, grade);
      navigate('/'); // Go directly to dashboard
    } catch (err) {
      setError('Failed to create an account. Try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh', 
      background: '#f5f5f5', 
      padding: '20px' 
    }}>
      <div style={{ 
        background: '#fff', 
        padding: '40px', 
        borderRadius: '8px', 
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        maxWidth: '400px', 
        width: '100%' 
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 20 }}>
          <img src={graderLogo} alt="Grader Logo" style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 10 }} />
          <h1>Join <span style={{ color: '#4a6ee0' }}>grader</span>!</h1>
          <h2>Create your account to start your learning journey</h2>
        </div>
        
        {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your Name"
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your-email@example.com"
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a Password"
              required
              minLength={6}
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label htmlFor="age">Age</label>
            <input
              id="age"
              type="number"
              className="input-field"
              value={age}
              onChange={(e) => setAge(e.target.value === '' ? '' : parseInt(e.target.value))}
              placeholder="Your Age"
              min={5}
              max={15}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label htmlFor="grade">Grade Level</label>
            <select
              id="grade"
              className="input-field"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', marginTop: '5px' }}
            >
              <option value="" disabled>Select Your Grade</option>
              {gradeOptions.map((gradeOption) => (
                <option key={gradeOption} value={gradeOption}>
                  {gradeOption}
                </option>
              ))}
            </select>
          </div>
          
          <button 
            type="submit" 
            className="btn" 
            disabled={isLoading}
            style={{ 
              width: '100%', 
              padding: '10px', 
              background: '#4a6ee0', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginBottom: '15px'
            }}
          >
            {isLoading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', margin: '15px 0' }}>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ccc' }} />
          <span style={{ padding: '0 10px', color: '#666', fontSize: '14px' }}>OR</span>
          <hr style={{ flex: 1, border: 'none', borderTop: '1px solid #ccc' }} />
        </div>

        {/* Google Sign Up */}
        <button
          onClick={googleSignIn}
          style={{
            width: '100%',
            padding: '10px',
            background: '#fff',
            color: '#444',
            border: '1px solid #dadce0',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 600,
            marginBottom: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            boxShadow: '0 1px 2px rgba(60,64,67,.08)',
            transition: 'box-shadow 0.2s',
          }}
          onMouseOver={e => (e.currentTarget.style.boxShadow = '0 2px 4px rgba(60,64,67,.15)')}
          onMouseOut={e => (e.currentTarget.style.boxShadow = '0 1px 2px rgba(60,64,67,.08)')}
        >
          <svg width="24" height="24" viewBox="0 0 24 24"><g><path fill="#4285F4" d="M12 12.2727V9.54547H20.7273C20.9091 10.5455 21 11.4546 21 12.5455C21 16.0909 18.5455 18.5455 15 18.5455C12.0909 18.5455 9.81818 16.2727 9.81818 13.3636C9.81818 12.8182 9.90909 12.3636 10 11.9091H12V12.2727Z"/><path fill="#34A853" d="M12 21C15.8182 21 18.8182 18.0909 18.8182 14.2727C18.8182 13.6364 18.7273 13.0909 18.6364 12.5455H12V15.2727H15.5455C15.0909 16.5455 13.8182 17.4545 12 17.4545C9.27273 17.4545 7.09091 15.2727 7.09091 12.5455C7.09091 9.81818 9.27273 7.63636 12 7.63636C13.0909 7.63636 14.0909 8.09091 14.8182 8.81818L17.0909 6.54545C15.8182 5.27273 14.0909 4.45455 12 4.45455C7.81818 4.45455 4.45455 7.81818 4.45455 12C4.45455 16.1818 7.81818 19.5455 12 19.5455Z"/><path fill="#FBBC05" d="M21 12.5455C21 11.4546 20.9091 10.5455 20.7273 9.54547H12V12.2727H17.4545C17.1818 13.0909 16.6364 13.8182 15.9091 14.2727L18.0909 16.4545C19.2727 15.2727 20.0909 13.8182 20.0909 12.5455H21Z"/><path fill="#EA4335" d="M12 4.45455C14.0909 4.45455 15.8182 5.27273 17.0909 6.54545L14.8182 8.81818C14.0909 8.09091 13.0909 7.63636 12 7.63636C9.27273 7.63636 7.09091 9.81818 7.09091 12.5455C7.09091 15.2727 9.27273 17.4545 12 17.4545C13.8182 17.4545 15.0909 16.5455 15.5455 15.2727H12V12.2727H18.6364C18.7273 13.0909 18.8182 13.6364 18.8182 14.2727C18.8182 18.0909 15.8182 21 12 21Z"/></g></svg>
          Sign up with Google
        </button>

        <p style={{ textAlign: 'center', marginTop: '20px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#4a6ee0', textDecoration: 'none', fontWeight: 500 }}>
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
