
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PlayerSetup from '@/components/PlayerSetup';
import GameSettings from '@/components/GameSettings';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const Index = () => {
  const navigate = useNavigate();
  const [player1Name, setPlayer1Name] = useState('Player 1');
  const [player2Name, setPlayer2Name] = useState('Player 2');
  const [raceTo, setRaceTo] = useState(7);

  const handleBegin = () => {
    navigate('/scoreboard', { 
      state: { 
        player1Name, 
        player2Name, 
        raceTo 
      } 
    });
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold tracking-tight mb-2">Score Keeper</h1>
          <p className="text-gray-500">Track your game scores with style</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="card-subtle p-6 mb-6"
        >
          <h2 className="text-lg font-medium mb-4">Player Setup</h2>
          <PlayerSetup 
            player1Name={player1Name}
            player2Name={player2Name}
            setPlayer1Name={setPlayer1Name}
            setPlayer2Name={setPlayer2Name}
          />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="card-subtle p-6 mb-8"
        >
          <h2 className="text-lg font-medium mb-4">Game Settings</h2>
          <GameSettings raceTo={raceTo} setRaceTo={setRaceTo} />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-col gap-3"
        >
          <Button 
            onClick={handleBegin} 
            className="w-full py-6 text-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
          >
            Begin Game
          </Button>
          <Button 
            variant="outline" 
            className="w-full py-6 text-lg"
          >
            View History
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Index;
