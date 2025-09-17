import React, { useState, useEffect, useCallback } from 'react';
import StyledButton from '../StyledButton';
import useLocalStorage from '../../hooks/useLocalStorage';
import { playSuccessSound, playGameOverSound } from '../../utils/audio';
import moleImg from './assets/mole.png'; // Assuming you have a mole image

interface WhackAMoleGameProps {
  onBack: () => void;
  onNewHighScore: (gameName: string, score: number) => void;
}

const GAME_DURATION = 30; // seconds

const WhackAMoleGame: React.FC<WhackAMoleGameProps> = ({ onBack, onNewHighScore }) => {
  const [moles, setMoles] = useState<boolean[]>(Array(9).fill(false));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'over'>('idle');
  const [highScore, setHighScore] = useLocalStorage('whack-a-mole-highscore', 0);
  const scoreKey = React.useMemo(() => Date.now(), [score]);

  const popMole = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * moles.length);
    setMoles(prevMoles => {
        const newMoles = [...prevMoles];
        newMoles[randomIndex] = true;
        return newMoles;
    });

    setTimeout(() => {
        setMoles(prevMoles => {
            const newMoles = [...prevMoles];
            newMoles[randomIndex] = false;
            return newMoles;
        });
    }, Math.random() * 500 + 500); // Mole visible for 0.5-1s
  }, [moles.length]);

  useEffect(() => {
      if (gameState !== 'playing') return;

      const gameInterval = setInterval(popMole, 700);
      const timerInterval = setInterval(() => {
          setTimeLeft(prev => prev - 1);
      }, 1000);

      if (timeLeft <= 0) {
          setGameState('over');
          playGameOverSound();
          clearInterval(gameInterval);
          clearInterval(timerInterval);
          if (score > highScore) {
              setHighScore(score);
              onNewHighScore('Whack-A-Mole', score);
          }
      }

      return () => {
          clearInterval(gameInterval);
          clearInterval(timerInterval);
      };
  }, [gameState, popMole, timeLeft, score, highScore, onNewHighScore, setHighScore]);
  
  const startGame = () => {
      setScore(0);
      setTimeLeft(GAME_DURATION);
      setGameState('playing');
  };

  const whackMole = (index: number) => {
      if (!moles[index] || gameState !== 'playing') return;
      playSuccessSound();
      setScore(prev => prev + 1);
      setMoles(prevMoles => {
          const newMoles = [...prevMoles];
          newMoles[index] = false;
          return newMoles;
      });
  };

  return (
    <div className="flex flex-col items-center p-4 w-full max-w-md mx-auto text-center animate-fade-in-up">
      <h2 className="text-4xl font-bold mb-2">Whack-A-Mole</h2>
      <p className="text-slate-400 mb-4">Click the moles as fast as you can!</p>
      
      <div className="flex gap-8 mb-4 text-xl">
        <p>Score: <span key={scoreKey} className="font-bold text-cyan-400 animate-score-pop">{score}</span></p>
        <p>Time Left: <span className="font-bold text-red-400">{timeLeft}</span></p>
      </div>
       <p className="mb-4 text-lg">High Score: <span className="font-bold text-yellow-400">{highScore}</span></p>

      <div className="relative w-80 h-80 md:w-96 md:h-96 bg-green-800 rounded-lg p-2">
         {(gameState === 'idle' || gameState === 'over') && (
            <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-10 rounded-lg">
                <h3 className="text-3xl font-bold text-white mb-4">
                    {gameState === 'over' ? `Time's Up! Score: ${score}` : 'Ready?'}
                </h3>
                <StyledButton onClick={startGame}>
                    {gameState === 'over' ? 'Play Again' : 'Start Game'}
                </StyledButton>
            </div>
        )}
        <div className="grid grid-cols-3 gap-2 w-full h-full">
            {moles.map((isUp, index) => (
                <div key={index} className="w-full h-full bg-yellow-900/50 rounded-full flex items-center justify-center overflow-hidden cursor-pointer" onClick={() => whackMole(index)}>
                   <div className={`w-16 h-16 bg-yellow-800 rounded-full transition-transform duration-200 ${isUp ? 'translate-y-0' : 'translate-y-full'}`} />
                </div>
            ))}
        </div>
      </div>

      <button onClick={onBack} className="mt-12 text-slate-400 hover:text-cyan-400 transition-colors">
        &larr; Back to Menu
      </button>
    </div>
  );
};

export default WhackAMoleGame;
