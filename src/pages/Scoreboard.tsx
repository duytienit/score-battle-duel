
import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ScoreControl from '@/components/ScoreControl';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/contexts/SettingsContext';
import { useSound } from '@/hooks/useSound';
import { toast } from "sonner";

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

  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [winner, setWinner] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [activePlayer, setActivePlayer] = useState<1 | 2>(1);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isTimerWarning, setIsTimerWarning] = useState(false);

  const timerRef = useRef<number | null>(null);
  
  const { timerEnabled, timerDuration, vibrationEnabled } = useSettings();
  const { playSound } = useSound();

  // Initialize timer when component mounts
  useEffect(() => {
    if (timerEnabled) {
      setTimeLeft(timerDuration);
      setIsTimerRunning(true);
    }
  }, [timerEnabled, timerDuration]);

  const checkWinner = useCallback(() => {
    if (player1Score >= raceTo) {
      setWinner(player1Name);
      stopTimer();
      return true;
    }
    if (player2Score >= raceTo) {
      setWinner(player2Name);
      stopTimer();
      return true;
    }
    return false;
  }, [player1Score, player2Score, raceTo, player1Name, player2Name]);

  useEffect(() => {
    checkWinner();
  }, [player1Score, player2Score, checkWinner]);

  // Update player score and handle timer
  const handlePlayer1ScoreChange = (newScore: number) => {
    setPlayer1Score(newScore);
    if (activePlayer !== 1) {
      switchPlayer();
    } else {
      restartTimer();
    }
  };

  const handlePlayer2ScoreChange = (newScore: number) => {
    setPlayer2Score(newScore);
    if (activePlayer !== 2) {
      switchPlayer();
    } else {
      restartTimer();
    }
  };

  // Timer functions
  const startTimer = useCallback(() => {
    if (!timerEnabled || timerRef.current !== null) return;
    
    setIsTimerRunning(true);
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === null) return null;
        
        // Show warning when 5 seconds or less remain
        if (prevTime <= 6 && prevTime > 1 && !isTimerWarning) {
          setIsTimerWarning(true);
          playSound('timeWarning');
        }
        
        // Time's up
        if (prevTime <= 1) {
          stopTimer();
          handleTimeUp();
          return 0;
        }
        
        return prevTime - 1;
      });
    }, 1000);
  }, [timerEnabled, isTimerWarning]);

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsTimerRunning(false);
  };

  const restartTimer = () => {
    stopTimer();
    setTimeLeft(timerDuration);
    setIsTimerWarning(false);
    startTimer();
  };

  // Handle timer expiration
  const handleTimeUp = () => {
    if (!winner) {
      playSound('timeUp');
      
      if (vibrationEnabled) {
        // Use vibration if available
        if (navigator.vibrate) {
          navigator.vibrate([200, 100, 200]);
        }
      }
      
      toast.info(`Time's up! ${activePlayer === 1 ? player1Name : player2Name}'s turn has ended.`);
      switchPlayer();
    }
  };

  // Switch active player
  const switchPlayer = () => {
    setActivePlayer(activePlayer === 1 ? 2 : 1);
    restartTimer();
  };

  // Start timer when component mounts
  useEffect(() => {
    if (timerEnabled && !winner) {
      startTimer();
    }
    
    return () => {
      stopTimer();
    };
  }, [timerEnabled, winner, startTimer]);

  const handleReset = () => {
    setPlayer1Score(0);
    setPlayer2Score(0);
    setWinner(null);
    restartTimer();
  };

  const handleNewGame = () => {
    navigate('/');
  };

  const goToSettings = () => {
    navigate('/settings');
  };

  return (
    <div className="h-screen w-screen overflow-hidden">
      <div className="landscape-container">
        {/* Player 1 Section */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`player-section player-1 w-1/2 p-4 relative ${activePlayer === 1 && isTimerRunning ? 'ring-4 ring-white/30' : ''}`}
        >
          <div className="absolute top-4 left-4 z-10 flex gap-2">
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
          </div>

          <h2 className="text-xl md:text-2xl font-semibold mt-8 animate-slide-down">
            {player1Name}
          </h2>
          
          <div className={`score-display text-8xl md:text-9xl lg:text-[10rem] font-bold ${player1Score > player2Score ? 'scale-110' : ''}`}>
            {player1Score}
          </div>
          
          <ScoreControl 
            score={player1Score}
            setScore={handlePlayer1ScoreChange}
            isPlayer1={true}
            disabled={!!winner}
          />
        </motion.div>

        {/* Player 2 Section */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`player-section player-2 w-1/2 p-4 relative ${activePlayer === 2 && isTimerRunning ? 'ring-4 ring-white/30' : ''}`}
        >
          <div className="absolute top-4 right-4 z-10">
            <button 
              onClick={handleReset}
              className="bg-white/20 text-white px-3 py-1.5 rounded-md text-sm hover:bg-white/30 transition-colors"
            >
              Reset
            </button>
          </div>

          <h2 className="text-xl md:text-2xl font-semibold mt-8 animate-slide-down">
            {player2Name}
          </h2>
          
          <div className={`score-display text-8xl md:text-9xl lg:text-[10rem] font-bold ${player2Score > player1Score ? 'scale-110' : ''}`}>
            {player2Score}
          </div>
          
          <ScoreControl 
            score={player2Score}
            setScore={handlePlayer2ScoreChange}
            isPlayer1={false}
            disabled={!!winner}
          />
        </motion.div>

        {/* Center Overlay for Race To and Timer */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 w-32 text-center">
          <div className="glass rounded-lg p-2 shadow-lg">
            <div className="text-sm font-medium text-gray-800">RACE TO</div>
            <div className="text-2xl font-bold text-gray-900">{raceTo}</div>
            {timerEnabled && timeLeft !== null && (
              <div className={`text-sm font-medium mt-1 ${isTimerWarning ? 'text-red-600 animate-pulse font-bold' : 'text-gray-700'}`}>
                {timeLeft}s
              </div>
            )}
          </div>
        </div>

        {/* Active Player Indicator */}
        {!winner && timerEnabled && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
            <div className={`text-sm font-medium px-3 py-1.5 rounded-full glass ${isTimerWarning ? 'bg-red-500/20 text-red-100' : ''}`}>
              {activePlayer === 1 ? player1Name : player2Name}'s Turn
            </div>
          </div>
        )}

        {/* Winner Overlay */}
        {winner && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/50 flex items-center justify-center z-30"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="glass-dark text-white p-8 rounded-xl text-center shadow-2xl max-w-md"
            >
              <h2 className="text-4xl font-bold mb-2">Winner!</h2>
              <p className="text-xl mb-6">{winner}</p>
              <div className="flex gap-3">
                <Button 
                  onClick={handleReset} 
                  variant="outline"
                  className="w-1/2 border-white/30 text-white hover:bg-white/10"
                >
                  Play Again
                </Button>
                <Button 
                  onClick={handleNewGame}
                  className="w-1/2"
                >
                  New Game
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Scoreboard;
