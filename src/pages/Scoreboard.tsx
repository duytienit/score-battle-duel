
import { useState, useEffect, useCallback, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ScoreControl from '@/components/ScoreControl';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { useSettings } from '@/contexts/SettingsContext';
import { useSound } from '@/hooks/useSound';
import { toast } from "sonner";
import { Mountain, Trophy, Save } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import confetti from 'canvas-confetti';
import MatchHistory, { MatchRecord } from '@/components/MatchHistory';

interface LocationState {
  player1Name: string;
  player2Name: string;
  raceTo: number;
}

const MATCH_HISTORY_KEY = 'scoreboard_match_history';

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
  const [resultSaved, setResultSaved] = useState(false);
  const [matchHistory, setMatchHistory] = useState<MatchRecord[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [matchStartTime] = useState(Date.now());
  
  const timerRef = useRef<number | null>(null);
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);
  
  const { timerEnabled, timerDuration, vibrationEnabled, soundEnabled } = useSettings();
  const { playSound } = useSound();

  // Check for hill points (1 away from winning)
  const isHillPoint = (score: number) => score === raceTo - 1;
  const player1OnHill = isHillPoint(player1Score);
  const player2OnHill = isHillPoint(player2Score);

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

  // Initialize timer when component mounts
  useEffect(() => {
    if (timerEnabled) {
      setTimeLeft(timerDuration);
      setIsTimerRunning(true);
    }
  }, [timerEnabled, timerDuration]);

  // Confetti effect for victory
  const triggerConfetti = useCallback(() => {
    if (confettiCanvasRef.current) {
      const myConfetti = confetti.create(confettiCanvasRef.current, {
        resize: true,
        useWorker: true
      });
      
      myConfetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, []);

  const checkWinner = useCallback(() => {
    if (player1Score >= raceTo) {
      setWinner(player1Name);
      stopTimer();
      if (soundEnabled) {
        playSound('timeUp'); // Use the timeUp sound as victory sound temporarily
      }
      setTimeout(triggerConfetti, 300);
      return true;
    }
    if (player2Score >= raceTo) {
      setWinner(player2Name);
      stopTimer();
      if (soundEnabled) {
        playSound('timeUp'); // Use the timeUp sound as victory sound temporarily
      }
      setTimeout(triggerConfetti, 300);
      return true;
    }
    return false;
  }, [player1Score, player2Score, raceTo, player1Name, player2Name, playSound, soundEnabled, triggerConfetti]);

  useEffect(() => {
    checkWinner();
  }, [player1Score, player2Score, checkWinner]);

  // Update player score and handle timer
  const handlePlayer1ScoreChange = (newScore: number) => {
    const oldScore = player1Score;
    setPlayer1Score(newScore);
    
    // Play hill point sound if entering hill
    if (newScore === raceTo - 1 && oldScore < raceTo - 1) {
      playSound('timeWarning'); // Use warning sound for hill effect temporarily
      
      if (vibrationEnabled && navigator.vibrate) {
        navigator.vibrate(100);
      }
    }
    
    if (activePlayer !== 1) {
      switchPlayer();
    } else {
      restartTimer();
    }
  };

  const handlePlayer2ScoreChange = (newScore: number) => {
    const oldScore = player2Score;
    setPlayer2Score(newScore);
    
    // Play hill point sound if entering hill
    if (newScore === raceTo - 1 && oldScore < raceTo - 1) {
      playSound('timeWarning'); // Use warning sound for hill effect temporarily
      
      if (vibrationEnabled && navigator.vibrate) {
        navigator.vibrate(100);
      }
    }
    
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
  }, [timerEnabled, isTimerWarning, playSound]);

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

  // Save match result to history
  const saveMatchResult = () => {
    if (resultSaved || !winner) return;
    
    const matchDuration = Date.now() - matchStartTime;
    
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
  };

  const handleReset = () => {
    setPlayer1Score(0);
    setPlayer2Score(0);
    setWinner(null);
    setResultSaved(false);
    restartTimer();
  };

  const handleNewGame = () => {
    navigate('/');
  };

  const goToSettings = () => {
    navigate('/settings');
  };

  const clearMatchHistory = () => {
    setMatchHistory([]);
    localStorage.removeItem(MATCH_HISTORY_KEY);
    toast.success("Match history cleared");
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
            
            <button 
              onClick={() => setShowHistory(true)}
              className="bg-white/20 text-white px-3 py-1.5 rounded-md text-sm hover:bg-white/30 transition-colors"
            >
              History
            </button>
          </div>

          <h2 className="text-xl md:text-2xl font-semibold mt-8 animate-slide-down">
            {player1Name}
          </h2>
          
          <div className={`score-display text-8xl md:text-9xl lg:text-[10rem] font-bold ${player1Score > player2Score ? 'scale-110' : ''} ${player1OnHill ? 'text-amber-300 animate-pulse' : ''}`}>
            {player1Score}
            {player1OnHill && (
              <span className="absolute text-amber-500 ml-2 animate-pulse">
                <Mountain size={48} />
              </span>
            )}
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
          
          <div className={`score-display text-8xl md:text-9xl lg:text-[10rem] font-bold ${player2Score > player1Score ? 'scale-110' : ''} ${player2OnHill ? 'text-amber-300 animate-pulse' : ''}`}>
            {player2Score}
            {player2OnHill && (
              <span className="absolute text-amber-500 ml-2 animate-pulse">
                <Mountain size={48} />
              </span>
            )}
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
            <canvas
              ref={confettiCanvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none z-10"
            />
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="glass-dark text-white p-8 rounded-xl text-center shadow-2xl max-w-md relative z-20"
            >
              <Trophy className="w-16 h-16 text-amber-400 mx-auto mb-2" />
              <h2 className="text-4xl font-bold mb-2">Victory!</h2>
              <p className="text-2xl mb-6">{winner} wins {winner === player1Name ? player1Score : player2Score}-{winner === player1Name ? player2Score : player1Score}</p>
              
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={saveMatchResult}
                  variant="outline"
                  disabled={resultSaved}
                  className="w-full border-white/30 text-white hover:bg-white/10 flex items-center justify-center gap-2"
                >
                  <Save size={16} />
                  {resultSaved ? "Result Saved" : "Save Result"}
                </Button>
                
                <Button 
                  onClick={handleReset} 
                  variant="outline"
                  className="w-full border-white/30 text-white hover:bg-white/10"
                >
                  Play Again
                </Button>
                
                <Button 
                  onClick={handleNewGame}
                  className="w-full"
                >
                  New Game
                </Button>
              </div>
            </motion.div>
          </motion.div>
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
