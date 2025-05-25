
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

const RippleButton: React.FC<RippleButtonProps> = ({ 
  children, 
  className,
  variant = 'default',
  size = 'md',
  ...props 
}) => {
  const [ripples, setRipples] = useState<{ left: number; top: number; id: number }[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);
  let nextId = useRef(0);

  const addRipple = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (buttonRef.current) {
      const button = buttonRef.current;
      const rect = button.getBoundingClientRect();
      const left = e.clientX - rect.left;
      const top = e.clientY - rect.top;
      
      const newRipple = {
        left,
        top,
        id: nextId.current
      };
      
      nextId.current += 1;
      setRipples([...ripples, newRipple]);
      
      // Clean up ripple after animation completes
      setTimeout(() => {
        setRipples(ripples => ripples.filter(r => r.id !== newRipple.id));
      }, 800); // Match the animation duration
    }
  };

  const variantClasses = {
    default: 'bg-slate-200 hover:bg-slate-300 text-slate-800',
    primary: 'bg-grader-green hover:bg-grader-green/90 text-white',
    secondary: 'bg-grader-orange hover:bg-grader-orange/90 text-white',
    outline: 'bg-transparent border border-grader-green text-grader-green hover:bg-grader-green/10',
    ghost: 'bg-transparent hover:bg-slate-100 text-slate-800'
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      ref={buttonRef}
      className={cn(
        'relative overflow-hidden rounded-md font-medium transition-colors',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      onClick={addRipple}
      {...props}
    >
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="ripple absolute bg-white/20 rounded-full pointer-events-none animate-ripple"
          style={{
            left: ripple.left,
            top: ripple.top,
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
      {children}
    </button>
  );
};

export { RippleButton };
