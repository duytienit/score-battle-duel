
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { useSound } from '@/hooks/useSound';

interface ScoreControlProps {
  score: number;
  setScore: (score: number) => void;
  isPlayer1: boolean;
  disabled: boolean;
}

const ScoreControl = ({ 
  score, 
  setScore, 
  isPlayer1, 
  disabled 
}: ScoreControlProps) => {
  const [animateScore, setAnimateScore] = useState(false);
  const { playSound } = useSound();

  const handleIncrement = () => {
    if (disabled) return;
    setScore(score + 1);
    triggerAnimation();
    playSound('score');
  };

  const handleDecrement = () => {
    if (disabled || score <= 0) return;
    setScore(score - 1);
    triggerAnimation();
  };

  const triggerAnimation = () => {
    setAnimateScore(true);
    setTimeout(() => setAnimateScore(false), 300);
  };

  const colorClass = isPlayer1 ? 'player1' : 'player2';

  return (
    <div className="w-full flex justify-center items-center gap-4 mb-8">
      <button
        onClick={handleDecrement}
        disabled={disabled || score <= 0}
        className={`score-btn minus-btn w-16 h-16 md:w-20 md:h-20 bg-${colorClass}-dark`}
        aria-label="Decrease score"
      >
        <Minus size={24} />
      </button>
      
      <button
        onClick={handleIncrement}
        disabled={disabled}
        className={`score-btn plus-btn w-16 h-16 md:w-20 md:h-20 bg-${colorClass}-DEFAULT`}
        aria-label="Increase score"
      >
        <Plus size={24} />
      </button>
    </div>
  );
};

export default ScoreControl;
