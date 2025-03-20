
import React from 'react';
import { motion } from 'framer-motion';
import { Mountain } from 'lucide-react';
import ScoreControl from '@/components/ScoreControl';

interface PlayerSectionProps {
  playerName: string;
  score: number;
  isPlayerActive: boolean;
  isTimerRunning: boolean;
  isHill: boolean;
  winner: string | null;
  isPlayer1: boolean;
  handleScoreChange: (newScore: number) => void;
  sideButtons?: React.ReactNode;
}

const PlayerSection = ({
  playerName,
  score,
  isPlayerActive,
  isTimerRunning,
  isHill,
  winner,
  isPlayer1,
  handleScoreChange,
  sideButtons
}: PlayerSectionProps) => {
  const isWinner = winner === playerName;
  
  return (
    <motion.div 
      initial={{ x: isPlayer1 ? -50 : 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className={`player-section ${isPlayer1 ? 'player-1' : 'player-2'} w-1/2 p-4 relative ${isPlayerActive && isTimerRunning ? 'ring-4 ring-white/30' : ''}`}
    >
      {sideButtons && (
        <div className={`absolute top-4 ${isPlayer1 ? 'left-4' : 'right-4'} z-10 flex gap-2`}>
          {sideButtons}
        </div>
      )}

      <h2 className="text-xl md:text-2xl font-semibold mt-8 animate-slide-down">
        {playerName}
      </h2>
      
      <div className={`score-display text-8xl md:text-9xl lg:text-[10rem] font-bold ${isWinner ? 'scale-110' : ''} ${isHill ? 'text-amber-300 animate-pulse' : ''}`}>
        {score}
        {isHill && (
          <span className="absolute text-amber-500 ml-2 animate-pulse">
            <Mountain size={48} />
          </span>
        )}
      </div>
      
      <ScoreControl 
        score={score}
        setScore={handleScoreChange}
        isPlayer1={isPlayer1}
        disabled={!!winner}
      />
    </motion.div>
  );
};

export default PlayerSection;
