
import { useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';

export const useConfetti = () => {
  const confettiCanvasRef = useRef<HTMLCanvasElement>(null);

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

  return { confettiCanvasRef, triggerConfetti };
};
