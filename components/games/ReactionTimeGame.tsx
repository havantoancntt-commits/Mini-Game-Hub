import React, { useState, useEffect, useRef } from 'react';
import StyledButton from '../StyledButton';
import { playSuccessSound, playErrorSound } from '../../utils/audio';
import useLocalStorage from '../../hooks/useLocalStorage';

interface ReactionTimeGameProps {
  onBack: () => void;
  onNewHighScore: (gameName: string, score: string) => void;
}

type GameState = 'idle' | 'waiting' | 'ready' | 'result' | 'too-soon';

const ReactionTimeGame: React.FC<ReactionTimeGameProps> = ({ onBack, onNewHighScore }) => {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [bestTime, setBestTime] = useLocalStorage<number | null>('reaction-time-highscore', null);
  // Fix: Initialize useRef with null and use the correct 'number' type for browser setTimeout.
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);

  const start = () => {
    setGameState('waiting');
    setReactionTime(null);
    timerRef.current = window.setTimeout(() => {
      startTimeRef.current = Date.now();
      setGameState('ready');
    }, Math.random() * 2000 + 1000);
  };

  const handleClick = () => {
    if (gameState === 'waiting') {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
      setGameState('too-soon');
      playErrorSound();
    }
    if (gameState === 'ready') {
      const endTime = Date.now();
      const time = endTime - startTimeRef.current;
      setReactionTime(time);
      setGameState('result');
      playSuccessSound();

      if (bestTime === null || time < bestTime) {
        setBestTime(time);
        onNewHighScore('Reaction Time', `${time}ms`);
      }
    }
  };
  
  useEffect(() => {
    return () => {
      if(timerRef.current) {
        window.clearTimeout(timerRef.current);
      }
    }
  }, []);

  const renderContent = () => {
    switch (gameState) {
      case 'idle':
        return <StyledButton onClick={start}>Start Game</StyledButton>;
      case 'waiting':
        return <p className="text-2xl">Wait for green...</p>;
      case 'ready':
        return <p className="text-4xl font-bold animate-pulse">CLICK!</p>;
      case 'too-soon':
        return (
          <div>
            <p className="text-2xl font-bold mb-4">Too Soon!</p>
            <StyledButton onClick={start}>Try Again</StyledButton>
          </div>
        );
      case 'result':
        return (
          <div>
            <p className="text-3xl font-bold mb-4">
              Your time: <span className="text-white animate-score-pop">{reactionTime}ms</span>
            </p>
            <StyledButton onClick={start}>Try Again</StyledButton>
          </div>
        );
    }
  };

  const getBoxColor = () => {
    switch (gameState) {
      case 'waiting': return 'bg-red-500';
      case 'ready': return 'bg-green-500 animate-pulse-glow-emerald';
      case 'too-soon': return 'bg-yellow-500';
      case 'result': return 'bg-cyan-500';
      default: return 'bg-slate-700';
    }
  };

  return (
    <div className="flex flex-col items-center p-4 w-full max-w-2xl mx-auto text-center animate-fade-in-up">
      <h2 className="text-4xl font-bold mb-4">Reaction Time</h2>
      <p className="text-slate-400 mb-6">When the red box turns green, click as fast as you can.</p>
      {bestTime && <p className="text-lg mb-4">Best Time: <span className="font-bold text-yellow-400">{bestTime}ms</span></p>}

      <div
        className={`w-full h-64 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${getBoxColor()}`}
        onClick={handleClick}
      >
        <div className="text-white">{renderContent()}</div>
      </div>
      
      <button onClick={onBack} className="mt-12 text-slate-400 hover:text-cyan-400 transition-colors">
        &larr; Back to Menu
      </button>
    </div>
  );
};

export default ReactionTimeGame;
