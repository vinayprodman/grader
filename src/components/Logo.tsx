
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', withText = true }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeClasses[size]} relative`}>
        <div className="absolute inset-0 bg-grader-orange rounded-lg"></div>
        <div className="absolute inset-1 bg-grader-green rounded-md flex items-center justify-center">
          <div className="relative">
            <span className="text-white font-bold text-2xl">G</span>
            <div className="absolute bottom-1 right-0 w-6 h-6">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="white" 
                strokeWidth="3" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            </div>
          </div>
        </div>
      </div>
      {withText && (
        <span className="text-grader-dark font-bold text-xl">grader</span>
      )}
    </div>
  );
};

export default Logo;
