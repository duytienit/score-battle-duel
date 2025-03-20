
import React from 'react';

interface TurnIndicatorProps {
  activePlayer: 1 | 2;
  player1Name: string;
  player2Name: string;
  isTimerWarning: boolean;
}

const TurnIndicator = ({ activePlayer, player1Name, player2Name, isTimerWarning }: TurnIndicatorProps) => {
  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
      <div className={`text-sm font-medium px-3 py-1.5 rounded-full glass ${isTimerWarning ? 'bg-red-500/20 text-red-100' : ''}`}>
        {activePlayer === 1 ? player1Name : player2Name}'s Turn
      </div>
    </div>
  );
};

export default TurnIndicator;
