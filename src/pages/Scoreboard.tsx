
import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { toast } from "sonner";
import { useConfetti } from '@/hooks/useConfetti';
import { useScoreboardTimer } from '@/hooks/useScoreboardTimer';
import { useScoreboardScore } from '@/hooks/useScoreboardScore';
import { useMatchHistory } from '@/hooks/useMatchHistory';
import PlayerSection from '@/components/scoreboard/PlayerSection';
import CenterOverlay from '@/components/scoreboard/CenterOverlay';
import TurnIndicator from '@/components/scoreboard/TurnIndicator';
import WinnerOverlay from '@/components/scoreboard/WinnerOverlay';
import MatchHistory from '@/components/MatchHistory';

interface LocationState {
  player1Name: string;
  player2Name: string;
  raceTo: number;
}

const Scoreboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { player1Name = 'Player 1', player2Name = 'Player 2', raceTo = 7 } = 
    (location.state as LocationState) || {};

  const [activePlayer, setActivePlayer] = useState<1 | 2>(1);
  const [matchStartTime] = useState(Date.now());
  
  const { timerEnabled, timerDuration, vibrationEnabled, soundEnabled } = useSettings();
  const { confettiCanvasRef, triggerConfetti } = useConfetti();
  
  const {
    matchHistory,
    resultSaved,
    showHistory,
    setShowHistory,
    saveMatchResult,
    clearMatchHistory,
    resetResultSaved
  } = useMatchHistory();

  const {
    player1Score,
    player2Score,
    winner,
    player1OnHill,
    player2OnHill,
    handlePlayer1ScoreChange,
    handlePlayer2ScoreChange,
    resetScores,
    setWinner
  } = useScoreboardScore({
    raceTo,
    onScoreChange: () => {}
  });

  // Handle timer expiration
  const handleTimeUp = useCallback(() => {
    if (!winner) {
      toast.info(`Time's up! ${activePlayer === 1 ? player1Name : player2Name}'s turn has ended.`);
      switchPlayer();
    }
  }, [winner, activePlayer, player1Name, player2Name]);

  const {
    timeLeft,
    isTimerRunning,
    isTimerWarning,
    restartTimer
  } = useScoreboardTimer({
    timerEnabled,
    timerDuration,
    soundEnabled,
    vibrationEnabled,
    onTimerExpired: handleTimeUp,
    winner
  });

  // Effect to trigger confetti when there is a winner
  useEffect(() => {
    if (winner) {
      setTimeout(triggerConfetti, 300);
    }
  }, [winner, triggerConfetti]);

  // Update the score with active player tracking
  const updatePlayer1Score = useCallback((newScore: number) => {
    handlePlayer1ScoreChange(newScore, player1Name, player2Name);
    
    if (activePlayer !== 1) {
      switchPlayer();
    } else {
      restartTimer();
    }
  }, [activePlayer, handlePlayer1ScoreChange, player1Name, player2Name, restartTimer]);

  const updatePlayer2Score = useCallback((newScore: number) => {
    handlePlayer2ScoreChange(newScore, player1Name, player2Name);
    
    if (activePlayer !== 2) {
      switchPlayer();
    } else {
      restartTimer();
    }
  }, [activePlayer, handlePlayer2ScoreChange, player1Name, player2Name, restartTimer]);

  // Switch active player
  const switchPlayer = useCallback(() => {
    setActivePlayer(activePlayer === 1 ? 2 : 1);
    restartTimer();
  }, [activePlayer, restartTimer]);

  // Save match result to history
  const handleSaveMatchResult = useCallback(() => {
    if (!winner) return;
    saveMatchResult(
      player1Name,
      player2Name,
      player1Score,
      player2Score,
      winner,
      raceTo
    );
  }, [winner, saveMatchResult, player1Name, player2Name, player1Score, player2Score, raceTo]);

  const handleReset = useCallback(() => {
    resetScores();
    resetResultSaved();
    restartTimer();
  }, [resetScores, resetResultSaved, restartTimer]);

  const handleNewGame = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const goToSettings = useCallback(() => {
    navigate('/settings');
  }, [navigate]);

  // Navigation buttons for Player 1 section
  const player1SideButtons = (
    <>
      <button 
        onClick={handleNewGame}
        className="bg-white/20 text-white px-3 py-1.5 rounded-md text-sm hover:bg-white/30 transition-colors"
      >
        New Game
      </button>
      
      <button 
        onClick={goToSettings}
        className="bg-white/20 text-white px-3 py-1.5 rounded-md text-sm hover:bg-white/30 transition-colors"
      >
        Settings
      </button>
      
      <button 
        onClick={() => setShowHistory(true)}
        className="bg-white/20 text-white px-3 py-1.5 rounded-md text-sm hover:bg-white/30 transition-colors"
      >
        History
      </button>
    </>
  );

  // Reset button for Player 2 section
  const player2SideButtons = (
    <button 
      onClick={handleReset}
      className="bg-white/20 text-white px-3 py-1.5 rounded-md text-sm hover:bg-white/30 transition-colors"
    >
      Reset
    </button>
  );

  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className="landscape-container">
        {/* Player 1 Section */}
        <PlayerSection 
          playerName={player1Name}
          score={player1Score}
          isPlayerActive={activePlayer === 1}
          isTimerRunning={isTimerRunning}
          isHill={player1OnHill}
          winner={winner}
          isPlayer1={true}
          handleScoreChange={updatePlayer1Score}
          sideButtons={player1SideButtons}
        />

        {/* Player 2 Section */}
        <PlayerSection 
          playerName={player2Name}
          score={player2Score}
          isPlayerActive={activePlayer === 2}
          isTimerRunning={isTimerRunning}
          isHill={player2OnHill}
          winner={winner}
          isPlayer1={false}
          handleScoreChange={updatePlayer2Score}
          sideButtons={player2SideButtons}
        />

        {/* Center Overlay for Race To and Timer */}
        <CenterOverlay 
          raceTo={raceTo}
          timerEnabled={timerEnabled}
          timeLeft={timeLeft}
          isTimerWarning={isTimerWarning}
        />

        {/* Active Player Indicator */}
        {!winner && timerEnabled && (
          <TurnIndicator 
            activePlayer={activePlayer}
            player1Name={player1Name}
            player2Name={player2Name}
            isTimerWarning={isTimerWarning}
          />
        )}

        {/* Winner Overlay */}
        {winner && (
          <WinnerOverlay 
            winner={winner}
            player1Name={player1Name}
            player2Name={player2Name}
            player1Score={player1Score}
            player2Score={player2Score}
            resultSaved={resultSaved}
            onSaveResult={handleSaveMatchResult}
            onReset={handleReset}
            onNewGame={handleNewGame}
            confettiCanvasRef={confettiCanvasRef}
          />
        )}
        
        {/* Match History Dialog */}
        <MatchHistory 
          open={showHistory}
          onOpenChange={setShowHistory}
          matches={matchHistory}
          onClearHistory={clearMatchHistory}
        />
      </div>
    </div>
  );
};

export default Scoreboard;
