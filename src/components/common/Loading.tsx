import React from 'react';

interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
  color?: string;
  dotCount?: number;
  dotSize?: number;
  dotSpacing?: number;
  animationDuration?: number;
}

const Loading: React.FC<LoadingProps> = ({ 
  text = 'Loading...', 
  fullScreen = false,
  color = '#4a6ee0',
  dotCount = 5,
  dotSize = 8,
  dotSpacing = 8,
  animationDuration = 0.8
}) => {
  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    ...(fullScreen && {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      zIndex: 1000
    })
  };

  const dotsContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: `${dotSpacing}px`
  };

  const dotStyle: React.CSSProperties = {
    width: `${dotSize}px`,
    height: `${dotSize}px`,
    borderRadius: '50%',
    backgroundColor: color,
    animation: `bounce ${animationDuration}s infinite ease-in-out`
  };

  const textStyle: React.CSSProperties = {
    color: color,
    fontSize: '1rem',
    fontWeight: 500
  };

  // Create keyframes for the bounce animation
  const keyframes = `
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div style={containerStyle}>
        <div style={dotsContainerStyle}>
          {[...Array(dotCount)].map((_, index) => (
            <div 
              key={index} 
              style={{
                ...dotStyle,
                animationDelay: `${index * (animationDuration / dotCount)}s`
              }} 
            />
          ))}
        </div>
        {text && <div style={textStyle}>{text}</div>}
      </div>
    </>
  );
};

export default Loading; 