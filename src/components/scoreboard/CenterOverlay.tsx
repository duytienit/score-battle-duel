
import React from 'react';

interface CenterOverlayProps {
  raceTo: number;
  timerEnabled: boolean;
  timeLeft: number | null;
  isTimerWarning: boolean;
}

const CenterOverlay = ({ 
  raceTo, 
  timerEnabled, 
  timeLeft, 
  isTimerWarning 
}: CenterOverlayProps) => {
  return (
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
  );
};

export default CenterOverlay;
