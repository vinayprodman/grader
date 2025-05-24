
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  showLabel?: boolean;
  className?: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  max,
  showLabel = false, 
  className,
  variant = 'default'
}) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const variantClasses = {
    default: 'bg-grader-green',
    success: 'bg-green-600',
    warning: 'bg-yellow-500',
    danger: 'bg-red-600'
  };
  
  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between mb-1 text-sm">
          <span>Progress</span>
          <span>{value} of {max} ({Math.round(percentage)}%)</span>
        </div>
      )}
      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
        <div 
          className={cn('h-full transition-all duration-500 ease-out', variantClasses[variant])} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export { ProgressBar };
