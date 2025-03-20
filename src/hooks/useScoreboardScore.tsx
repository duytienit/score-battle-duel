
import { useState, useCallback } from 'react';
import { useSound } from '@/hooks/useSound';
import { useSettings } from '@/contexts/SettingsContext';

interface UseScoreboardScoreProps {
  initialPlayer1Score?: number;
  initialPlayer2Score?: number;
  raceTo: number;
  onScoreChange?: () => void;
}

export const useScoreboardScore = ({
  initialPlayer1Score = 0,
  initialPlayer2Score = 0,
  raceTo,
  onScoreChange
}: UseScoreboardScoreProps) => {
  const [player1Score, setPlayer1Score] = useState(initialPlayer1Score);
  const [player2Score, setPlayer2Score] = useState(initialPlayer2Score);
  const [winner, setWinner] = useState<string | null>(null);
  
  const { vibrationEnabled, soundEnabled } = useSettings();
  const { playSound } = useSound();

  // Check for hill points (1 away from winning)
  const isHillPoint = useCallback((score: number) => score === raceTo - 1, [raceTo]);
  const player1OnHill = isHillPoint(player1Score);
  const player2OnHill = isHillPoint(player2Score);

  const checkWinner = useCallback((p1Score: number, p2Score: number, p1Name: string, p2Name: string) => {
    if (p1Score >= raceTo) {
      setWinner(p1Name);
      if (soundEnabled) {
        playSound('timeUp'); // Use the timeUp sound as victory sound temporarily
      }
      return true;
    }
    if (p2Score >= raceTo) {
      setWinner(p2Name);
      if (soundEnabled) {
        playSound('timeUp'); // Use the timeUp sound as victory sound temporarily
      }
      return true;
    }
    return false;
  }, [raceTo, playSound, soundEnabled]);

  const handlePlayer1ScoreChange = useCallback((newScore: number, player1Name: string, player2Name: string) => {
    const oldScore = player1Score;
    setPlayer1Score(newScore);
    
    // Play hill point sound if entering hill
    if (newScore === raceTo - 1 && oldScore < raceTo - 1) {
      playSound('timeWarning'); // Use warning sound for hill effect temporarily
      
      if (vibrationEnabled && navigator.vibrate) {
        navigator.vibrate(100);
      }
    }
    
    checkWinner(newScore, player2Score, player1Name, player2Name);
    if (onScoreChange) onScoreChange();
  }, [player1Score, player2Score, raceTo, playSound, vibrationEnabled, checkWinner, onScoreChange]);

  const handlePlayer2ScoreChange = useCallback((newScore: number, player1Name: string, player2Name: string) => {
    const oldScore = player2Score;
    setPlayer2Score(newScore);
    
    // Play hill point sound if entering hill
    if (newScore === raceTo - 1 && oldScore < raceTo - 1) {
      playSound('timeWarning'); // Use warning sound for hill effect temporarily
      
      if (vibrationEnabled && navigator.vibrate) {
        navigator.vibrate(100);
      }
    }
    
    checkWinner(player1Score, newScore, player1Name, player2Name);
    if (onScoreChange) onScoreChange();
  }, [player1Score, player2Score, raceTo, playSound, vibrationEnabled, checkWinner, onScoreChange]);

  const resetScores = useCallback(() => {
    setPlayer1Score(0);
    setPlayer2Score(0);
    setWinner(null);
  }, []);

  return {
    player1Score,
    player2Score,
    winner,
    player1OnHill,
    player2OnHill,
    handlePlayer1ScoreChange,
    handlePlayer2ScoreChange,
    resetScores,
    setWinner
  };
};
