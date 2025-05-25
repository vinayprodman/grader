import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  withText?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = 'md', withText = true }) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
  };
  
  return (
    <div className="flex items-center gap-2">
      <img 
        src="/grader_logo.png" 
        alt="Grader Logo"
        className={`${sizeClasses[size]} object-contain`}
      />
      {withText && (
        <span className="text-grader-dark font-bold text-xl">grader</span>
      )}
    </div>
  );
};

export default Logo;
