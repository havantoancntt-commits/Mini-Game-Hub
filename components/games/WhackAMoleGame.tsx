import React, { useState, useEffect, useCallback } from 'react';
import StyledButton from '../StyledButton';
import useLocalStorage from '../../hooks/useLocalStorage';
import { playSuccessSound, playGameOverSound } from '../../utils/audio';

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
    if (gameState !== 'playing') return;
    const randomIndex = Math.floor(Math.random() * 9);
    setMoles(prevMoles => {
        const newMoles = Array(9).fill(false); // only one mole at a time
        newMoles[randomIndex] = true;
        return newMoles;
    });

    setTimeout(() => {
      setMoles(prevMoles => {
          const newMoles = [...prevMoles];
          if(newMoles[randomIndex]) { // if it wasn't whacked
            newMoles[randomIndex] = false;
          }
          return newMoles;
      });
    }, Math.random() * 400 + 600); // Mole visible for 0.6-1s
  }, [gameState]);


  useEffect(() => {
      if (gameState !== 'playing' || timeLeft <= 0) return;

      const gameInterval = setInterval(popMole, 800);
      const timerInterval = setInterval(() => {
          setTimeLeft(prev => {
              if (prev <= 1) {
                  clearInterval(gameInterval);
                  clearInterval(timerInterval);
                  setGameState('over');
                  playGameOverSound();
                  if (score > highScore) {
                      setHighScore(score);
                      onNewHighScore('Whack-A-Mole', score);
                  }
                  return 0;
              }
              return prev - 1;
          });
      }, 1000);

      return () => {
          clearInterval(gameInterval);
          clearInterval(timerInterval);
      };
  }, [gameState, popMole, score, highScore, onNewHighScore, setHighScore, timeLeft]);
  
  const startGame = () => {
      setScore(0);
      setMoles(Array(9).fill(false));
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
    <div className="flex flex-col items-center p-6 sm:p-8 w-full max-w-sm mx-auto text-center bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-700/50 animate-fade-in-up">
      <h2 className="text-4xl font-bold mb-2">Whack-A-Mole</h2>
      <p className="text-slate-400 mb-4">Click the moles as fast as you can!</p>
      
      <div className="flex gap-8 mb-4 text-xl">
        <p>Score: <span key={scoreKey} className="font-bold text-cyan-400 animate-score-pop">{score}</span></p>
        <p>Time Left: <span className="font-bold text-red-400">{timeLeft}</span></p>
      </div>
       <p className="mb-4 text-lg">High Score: <span className="font-bold text-yellow-400">{highScore}</span></p>

      <div className="relative w-full max-w-xs sm:max-w-sm aspect-square bg-green-800/70 rounded-lg p-2">
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
                <div key={index} className="w-full h-full bg-yellow-900/50 rounded-full flex items-center justify-center overflow-hidden cursor-pointer p-2" onClick={() => whackMole(index)}>
                   <div className={`w-full h-full bg-yellow-800 rounded-full transition-transform duration-150 ${isUp ? 'translate-y-0 scale-100' : 'translate-y-full scale-50'}`} />
                </div>
            ))}
        </div>
      </div>

      <button onClick={onBack} className="group mt-12 text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        <span>Back to Menu</span>
      </button>
    </div>
  );
};

export default WhackAMoleGame;