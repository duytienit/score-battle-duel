
import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WinnerOverlayProps {
  winner: string;
  player1Name: string;
  player2Name: string;
  player1Score: number;
  player2Score: number;
  resultSaved: boolean;
  onSaveResult: () => void;
  onReset: () => void;
  onNewGame: () => void;
  confettiCanvasRef: React.RefObject<HTMLCanvasElement>;
}

const WinnerOverlay = ({
  winner,
  player1Name,
  player2Name,
  player1Score,
  player2Score,
  resultSaved,
  onSaveResult,
  onReset,
  onNewGame,
  confettiCanvasRef
}: WinnerOverlayProps) => {
  return (
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
            onClick={onSaveResult}
            variant="outline"
            disabled={resultSaved}
            className="w-full border-white/30 text-white hover:bg-white/10 flex items-center justify-center gap-2"
          >
            <Save size={16} />
            {resultSaved ? "Result Saved" : "Save Result"}
          </Button>
          
          <Button 
            onClick={onReset} 
            variant="outline"
            className="w-full border-white/30 text-white hover:bg-white/10"
          >
            Play Again
          </Button>
          
          <Button 
            onClick={onNewGame}
            className="w-full"
          >
            New Game
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default WinnerOverlay;
