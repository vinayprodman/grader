import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
  to?: string | number; // path or -1 for history
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

const BackButton: React.FC<BackButtonProps> = ({ to = -1, label = 'Back', className = '', style }) => {
  const navigate = useNavigate();
  return (
    <button
      className={`back-button ${className}`}
      style={style}
      onClick={() => typeof to === 'number' ? navigate(to) : navigate(to)}
      aria-label={label}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="back-label">{label}</span>
      </span>
    </button>
  );
};

export default BackButton;
