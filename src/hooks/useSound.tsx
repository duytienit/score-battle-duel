
import { useRef, useEffect } from 'react';
import { useSettings } from '@/contexts/SettingsContext';

type SoundType = 'score' | 'timeWarning' | 'timeUp';

export const useSound = () => {
  const { soundEnabled } = useSettings();
  const scoreAudioRef = useRef<HTMLAudioElement | null>(null);
  const timeWarningAudioRef = useRef<HTMLAudioElement | null>(null);
  const timeUpAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    scoreAudioRef.current = new Audio('/sounds/score.mp3');
    timeWarningAudioRef.current = new Audio('/sounds/time-warning.mp3');
    timeUpAudioRef.current = new Audio('/sounds/time-up.mp3');

    return () => {
      scoreAudioRef.current = null;
      timeWarningAudioRef.current = null;
      timeUpAudioRef.current = null;
    };
  }, []);

  const playSound = (type: SoundType) => {
    if (!soundEnabled) return;
    
    try {
      switch (type) {
        case 'score':
          if (scoreAudioRef.current) {
            scoreAudioRef.current.currentTime = 0;
            scoreAudioRef.current.play();
          }
          break;
        case 'timeWarning':
          if (timeWarningAudioRef.current) {
            timeWarningAudioRef.current.currentTime = 0;
            timeWarningAudioRef.current.play();
          }
          break;
        case 'timeUp':
          if (timeUpAudioRef.current) {
            timeUpAudioRef.current.currentTime = 0;
            timeUpAudioRef.current.play();
          }
          break;
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  return { playSound };
};
