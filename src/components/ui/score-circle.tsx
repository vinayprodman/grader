
import React from 'react';
import { cn } from '@/lib/utils';

interface ScoreCircleProps {
  score: number;
  total: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const ScoreCircle: React.FC<ScoreCircleProps> = ({ 
  score, 
  total,
  size = 'md',
  className 
}) => {
  const percentage = Math.round((score / total) * 100);
  
  // Color classes based on score percentage
  let colorClass = 'text-red-600';
  
  if (percentage >= 80) {
    colorClass = 'text-green-600';
  } else if (percentage >= 60) {
    colorClass = 'text-yellow-500';
  } else if (percentage >= 40) {
    colorClass = 'text-orange-500';
  }
  
  // Calculate stroke dash array and offset for circular progress
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };
  
  const fontSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  };
  
  return (
    <div className={cn('relative flex items-center justify-center', sizeClasses[size], className)}>
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          className="fill-transparent stroke-gray-100"
          cx="50"
          cy="50"
          r={radius}
          strokeWidth="8"
        />
        {/* Progress circle */}
        <circle
          className={cn("fill-transparent transition-all duration-1000 ease-out", {
            'stroke-green-600': percentage >= 80,
            'stroke-yellow-500': percentage >= 60 && percentage < 80,
            'stroke-orange-500': percentage >= 40 && percentage < 60,
            'stroke-red-600': percentage < 40
          })}
          cx="50"
          cy="50"
          r={radius}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center">
        <span className={cn('font-bold', fontSizeClasses[size], colorClass)}>
          {percentage}%
        </span>
        <span className="text-xs text-gray-500">
          {score}/{total}
        </span>
      </div>
    </div>
  );
};

export { ScoreCircle };
