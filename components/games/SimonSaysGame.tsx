import React, { useState, useEffect, useCallback } from 'react';
import StyledButton from '../StyledButton';
import useLocalStorage from '../../hooks/useLocalStorage';
import { playErrorSound, playWinSound } from '../../utils/audio';

interface SimonSaysGameProps {
  onBack: () => void;
}

const COLORS = ['green', 'red', 'yellow', 'blue'];
const COLOR_CLASSES = {
  green: 'bg-green-500',
  red: 'bg-red-500',
  yellow: 'bg-yellow-400',
  blue: 'bg-blue-500',
};
const ACTIVE_COLOR_CLASSES = {
  green: 'bg-green-300 scale-105',
  red: 'bg-red-300 scale-105',
  yellow: 'bg-yellow-200 scale-105',
  blue: 'bg-blue-300 scale-105',
};

const SimonSaysGame: React.FC<SimonSaysGameProps> = ({ onBack }) => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [level, setLevel] = useState(0);
  const [gameState, setGameState] = useState<'start' | 'computer' | 'player' | 'over'>('start');
  const [highScore, setHighScore] = useLocalStorage('simon-says-hs', 0);

  const playSound = (color: string) => {
    // A simple synth sound - we can't import the full audio utils here, so let's mock it
    const frequencies: { [key: string]: number } = {
        green: 329.63, // E4
        red: 440.00, // A4
        yellow: 587.33, // D5
        blue: 659.25, // E5
    };
    // Placeholder for sound playing logic
    // In a real scenario, this would integrate with a web audio API utility
  };

  const nextLevel = useCallback(() => {
    const nextColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    setSequence(prev => [...prev, nextColor]);
    setLevel(prev => prev + 1);
    setPlayerSequence([]);
    setGameState('computer');
  }, []);

  const startGame = () => {
    setSequence([]);
    setLevel(0);
    setTimeout(nextLevel, 500);
  };
  
  useEffect(() => {
    if (gameState === 'computer' && sequence.length > 0) {
      let i = 0;
      const interval = setInterval(() => {
        setActiveColor(sequence[i]);
        playSound(sequence[i]);
        setTimeout(() => setActiveColor(null), 300);
        i++;
        if (i >= sequence.length) {
          clearInterval(interval);
          setGameState('player');
        }
      }, 600);
    }
  }, [gameState, sequence]);
  
  const handleColorClick = (color: string) => {
    if (gameState !== 'player') return;

    playSound(color);
    const newPlayerSequence = [...playerSequence, color];
    setPlayerSequence(newPlayerSequence);

    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      playErrorSound();
      setGameState('over');
      if (level -1 > highScore) {
        setHighScore(level - 1);
      }
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      playWinSound();
      setTimeout(nextLevel, 1000);
    }
  };

  const renderGameContent = () => {
    if (gameState === 'start' || gameState === 'over') {
      return (
        <div className="text-center">
          {gameState === 'over' && <h2 className="text-4xl font-bold text-red-500 mb-4">Game Over!</h2>}
          <p className="text-2xl mb-4">
            {gameState === 'start' ? 'Press Start to Play' : `You reached level ${level - 1}.`}
          </p>
          <p className="text-lg text-yellow-400 mb-8">High Score: {highScore}</p>
          <StyledButton onClick={startGame}>Start Game</StyledButton>
        </div>
      );
    }

    return (
        <div className="flex flex-col items-center">
            <p className="text-2xl font-bold mb-4">Level: {level}</p>
            <p className="text-xl text-slate-400 mb-4 h-8">
              {gameState === 'computer' ? 'Watch...' : 'Your Turn...'}
            </p>
            <div className="grid grid-cols-2 gap-4">
                {COLORS.map(color => (
                <div
                    key={color}
                    onClick={() => handleColorClick(color)}
                    className={`w-32 h-32 sm:w-40 sm:h-40 rounded-full cursor-pointer transition-all duration-200
                                ${COLOR_CLASSES[color as keyof typeof COLOR_CLASSES]}
                                ${activeColor === color ? ACTIVE_COLOR_CLASSES[color as keyof typeof ACTIVE_COLOR_CLASSES] : ''}
                                ${gameState === 'player' ? 'hover:opacity-80' : 'pointer-events-none'}`}
                />
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

export default SimonSaysGame;
