import React, { useState, useEffect, useCallback } from 'react';
import StyledButton from '../StyledButton';
import useLocalStorage from '../../hooks/useLocalStorage';
import { playSuccessSound, playWinSound, playClickSound } from '../../utils/audio';

interface WhackAMoleGameProps {
  onBack: () => void;
}

const GAME_DURATION = 20; // seconds

const WhackAMoleGame: React.FC<WhackAMoleGameProps> = ({ onBack }) => {
  const [moles, setMoles] = useState<boolean[]>(Array(9).fill(false));
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'over'>('start');
  const [highScore, setHighScore] = useLocalStorage('whack-a-mole-hs', 0);

  const startGame = useCallback(() => {
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setGameState('playing');
  }, []);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setGameState('over');
      if (score > highScore) {
        setHighScore(score);
        playWinSound();
      }
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft, score, highScore, setHighScore]);

  useEffect(() => {
    let moleTimer: ReturnType<typeof setTimeout>;
    if (gameState === 'playing') {
        moleTimer = setTimeout(() => {
        const newMoles = Array(9).fill(false);
        const randomIndex = Math.floor(Math.random() * 9);
        newMoles[randomIndex] = true;
        setMoles(newMoles);
      }, 400 + Math.random() * 600); // Moles appear at random intervals
    }
    return () => clearTimeout(moleTimer);
  }, [gameState, moles]);

  const handleWhack = (index: number) => {
    if (moles[index]) {
      playSuccessSound();
      setScore(prev => prev + 1);
      setMoles(Array(9).fill(false)); // Mole disappears immediately
    } else {
        playClickSound(); // Sound for missing
    }
  };

  const renderGameContent = () => {
    if (gameState === 'start' || gameState === 'over') {
      return (
        <div className="text-center">
          {gameState === 'over' && <h2 className="text-4xl font-bold mb-4">Time's Up!</h2>}
           <p className="text-2xl mb-4">
            {gameState === 'start' ? 'Whack the moles as they appear!' : `Your score: ${score}`}
          </p>
          <p className="text-lg text-yellow-400 mb-8">High Score: {highScore}</p>
          <StyledButton onClick={startGame}>
            {gameState === 'start' ? 'Start Game' : 'Play Again'}
          </StyledButton>
        </div>
      );
    }

    return (
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center text-xl font-bold mb-6">
          <div>Score: <span className="text-white">{score}</span></div>
          <div className={`transition-colors ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : ''}`}>
            Time: <span className="text-white">{timeLeft}s</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 bg-lime-800 p-4 rounded-lg border-4 border-lime-900">
          {moles.map((isMole, index) => (
            <div key={index} className="w-24 h-24 bg-lime-700 rounded-full flex items-center justify-center overflow-hidden cursor-pointer" onClick={() => handleWhack(index)}>
              {isMole && (
                <div className="w-20 h-20 bg-amber-800 rounded-full animate-pop-in"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col items-center">
        {renderGameContent()}
         <div className="mt-12">
            <button onClick={onBack} className="text-slate-400 hover:text-cyan-400 transition-colors">
            &larr; Back to Menu
            </button>
        </div>
    </div>
  );
};

export default WhackAMoleGame;
