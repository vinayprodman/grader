import React from 'react';
import '../../styles/Loading.css';

interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
}

const Loading: React.FC<LoadingProps> = ({ 
  text = 'Loading...', 
  fullScreen = false 
}) => {
  return (
    <div className={`loading-container ${fullScreen ? 'full-screen' : ''}`}>
      <div className="dots-container">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="dot" />
        ))}
      </div>
      {text && <div className="loading-text">{text}</div>}
    </div>
  );
};

export default Loading; 