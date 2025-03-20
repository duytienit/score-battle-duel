
import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { MatchRecord } from '@/components/MatchHistory';

const MATCH_HISTORY_KEY = 'scoreboard_match_history';

export const useMatchHistory = () => {
  const [matchHistory, setMatchHistory] = useState<MatchRecord[]>([]);
  const [resultSaved, setResultSaved] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  // Load match history from localStorage
  useEffect(() => {
    const storedHistory = localStorage.getItem(MATCH_HISTORY_KEY);
    if (storedHistory) {
      try {
        setMatchHistory(JSON.parse(storedHistory));
      } catch (error) {
        console.error('Error loading match history:', error);
      }
    }
  }, []);

  const saveMatchResult = useCallback((
    player1Name: string,
    player2Name: string,
    player1Score: number,
    player2Score: number,
    winner: string,
    raceTo: number
  ) => {
    if (resultSaved || !winner) return;
    
    const newMatch: MatchRecord = {
      id: uuidv4(),
      player1Name,
      player2Name,
      player1Score,
      player2Score,
      winner,
      timestamp: Date.now(),
      raceTo
    };
    
    const updatedHistory = [newMatch, ...matchHistory];
    setMatchHistory(updatedHistory);
    localStorage.setItem(MATCH_HISTORY_KEY, JSON.stringify(updatedHistory));
    
    setResultSaved(true);
    toast.success("Match result saved!");
  }, [matchHistory, resultSaved]);

  const clearMatchHistory = useCallback(() => {
    setMatchHistory([]);
    localStorage.removeItem(MATCH_HISTORY_KEY);
    toast.success("Match history cleared");
  }, []);

  const resetResultSaved = useCallback(() => {
    setResultSaved(false);
  }, []);

  return {
    matchHistory,
    resultSaved,
    showHistory,
    setShowHistory,
    saveMatchResult,
    clearMatchHistory,
    resetResultSaved
  };
};
