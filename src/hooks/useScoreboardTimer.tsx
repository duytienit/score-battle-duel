
import { useState, useRef, useCallback, useEffect } from 'react';
import { useSound } from '@/hooks/useSound';
import { toast } from 'sonner';
import { useSettings } from '@/contexts/SettingsContext';

interface UseScoreboardTimerProps {
  timerEnabled: boolean;
  timerDuration: number;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  onTimerExpired: () => void;
  winner: string | null;
}

export const useScoreboardTimer = ({
  timerEnabled,
  timerDuration,
  soundEnabled,
  vibrationEnabled,
  onTimerExpired,
  winner
}: UseScoreboardTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isTimerWarning, setIsTimerWarning] = useState(false);
  
  const timerRef = useRef<number | null>(null);
  const { playSound } = useSound();

  // Initialize timer when component mounts
  useEffect(() => {
    if (timerEnabled) {
      setTimeLeft(timerDuration);
      setIsTimerRunning(true);
    }
  }, [timerEnabled, timerDuration]);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsTimerRunning(false);
  }, []);

  const startTimer = useCallback(() => {
    if (!timerEnabled || timerRef.current !== null) return;
    
    setIsTimerRunning(true);
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === null) return null;
        
        // Show warning when 5 seconds or less remain
        if (prevTime <= 6 && prevTime > 1 && !isTimerWarning) {
          setIsTimerWarning(true);
          if (soundEnabled) {
            playSound('timeWarning');
          }
        }
        
        // Time's up
        if (prevTime <= 1) {
          stopTimer();
          if (!winner) {
            if (soundEnabled) {
              playSound('timeUp');
            }
            
            if (vibrationEnabled) {
              // Use vibration if available
              if (navigator.vibrate) {
                navigator.vibrate([200, 100, 200]);
              }
            }
            
            onTimerExpired();
          }
          return 0;
        }
        
        return prevTime - 1;
      });
    }, 1000);
  }, [timerEnabled, isTimerWarning, playSound, soundEnabled, stopTimer, vibrationEnabled, winner, onTimerExpired]);

  const restartTimer = useCallback(() => {
    stopTimer();
    setTimeLeft(timerDuration);
    setIsTimerWarning(false);
    startTimer();
  }, [stopTimer, timerDuration, startTimer]);

  // Start timer when component mounts
  useEffect(() => {
    if (timerEnabled && !winner) {
      startTimer();
    }
    
    return () => {
      stopTimer();
    };
  }, [timerEnabled, winner, startTimer, stopTimer]);

  return {
    timeLeft,
    isTimerRunning,
    isTimerWarning,
    startTimer,
    stopTimer,
    restartTimer
  };
};
