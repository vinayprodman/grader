
import { useState, useEffect, useCallback } from 'react';

export const useTimer = (initialMinutes = 0, autoStart = true) => {
  const [isRunning, setIsRunning] = useState(autoStart);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [initialTime] = useState(initialMinutes * 60);
  const [timeRemaining, setTimeRemaining] = useState(initialMinutes * 60);
  
  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);
  
  const start = useCallback(() => {
    setIsRunning(true);
  }, []);
  
  const pause = useCallback(() => {
    setIsRunning(false);
  }, []);
  
  const reset = useCallback(() => {
    setElapsedTime(0);
    setTimeRemaining(initialTime);
    setIsRunning(false);
  }, [initialTime]);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    
    if (isRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
        setTimeRemaining(prev => Math.max(0, prev - 1));
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]);
  
  const percentageElapsed = initialTime > 0 ? (elapsedTime / initialTime) * 100 : 0;
  const percentageRemaining = 100 - percentageElapsed;
  
  // Alert when time is running out (1 minute remaining)
  useEffect(() => {
    if (timeRemaining === 60) {
      console.log("Time is running out! One minute remaining!");
    }
  }, [timeRemaining]);
  
  return {
    isRunning,
    elapsedTime,
    timeRemaining,
    formattedElapsed: formatTime(elapsedTime),
    formattedRemaining: formatTime(timeRemaining),
    percentageElapsed,
    percentageRemaining,
    start,
    pause,
    reset
  };
};
