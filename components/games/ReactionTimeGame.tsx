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
        return <p className="text-xl sm:text-2xl">Wait for green...</p>;
      case 'ready':
        return <p className="text-3xl sm:text-4xl font-bold animate-pulse">CLICK!</p>;
      case 'too-soon':
        return (
          <div>
            <p className="text-xl sm:text-2xl font-bold mb-4">Too Soon!</p>
            <StyledButton onClick={start}>Try Again</StyledButton>
          </div>
        );
      case 'result':
        return (
          <div>
            <p className="text-2xl sm:text-3xl font-bold mb-4">
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
      default: return 'bg-slate-700/80';
    }
  };

  return (
    <div className="flex flex-col items-center p-6 sm:p-8 w-full max-w-2xl mx-auto text-center bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-700/50 animate-fade-in-up">
      <h2 className="text-3xl sm:text-4xl font-bold mb-4">Reaction Time</h2>
      <p className="text-slate-400 mb-6">When the red box turns green, click as fast as you can.</p>
      {bestTime && <p className="text-lg mb-4">Best Time: <span className="font-bold text-yellow-400">{bestTime}ms</span></p>}

      <div
        className={`w-full h-64 sm:h-80 rounded-lg flex items-center justify-center cursor-pointer transition-colors ${getBoxColor()}`}
        onClick={handleClick}
      >
        <div className="text-white">{renderContent()}</div>
      </div>
      
      <button onClick={onBack} className="group mt-12 text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        <span>Back to Menu</span>
      </button>
    </div>
  );
};

export default ReactionTimeGame;