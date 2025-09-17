import React, { useState, useEffect, useCallback, useRef } from 'react';
import StyledButton from '../StyledButton';
import useLocalStorage from '../../hooks/useLocalStorage';
import { playSuccessSound, playErrorSound } from '../../utils/audio';

interface ReactionTimeGameProps {
  onBack: () => void;
}

type GameState = 'waiting' | 'ready' | 'active' | 'result';

const ReactionTimeGame: React.FC<ReactionTimeGameProps> = ({ onBack }) => {
  const [gameState, setGameState] = useState<GameState>('waiting');
  const [startTime, setStartTime] = useState<number>(0);
  const [score, setScore] = useState<number | null>(null);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const [highScore, setHighScore] = useLocalStorage('reaction-time-hs', Infinity);
  
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startGame = useCallback(() => {
    setIsNewHighScore(false);
    setGameState('ready');
    setScore(null);
    const delay = Math.random() * 3000 + 1000; // 1-4 seconds
    timerRef.current = setTimeout(() => {
      setGameState('active');
      setStartTime(Date.now());
    }, delay);
  }, []);

  const handleBoxClick = () => {
    if (gameState === 'active') {
      const endTime = Date.now();
      const currentScore = endTime - startTime;
      setScore(currentScore);
      playSuccessSound();
      if (currentScore < highScore) {
        setHighScore(currentScore);
        setIsNewHighScore(true);
      }
      setGameState('result');
    } else if (gameState === 'ready') {
      if (timerRef.current) clearTimeout(timerRef.current);
      playErrorSound();
      setScore(-1); 
      setGameState('result');
    }
  };
  
  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);
  
  const renderContent = () => {
    switch(gameState) {
      case 'waiting':
        return (
          <div className="text-center animate-pop-in">
            <h2 className="text-3xl font-bold mb-4">Get Ready</h2>
            <p className="text-slate-400 mb-8">Click the box when it turns <span className="text-emerald-400 font-bold">green</span>. Don't click too early!</p>
            {highScore !== Infinity && (
              <p className="text-lg text-yellow-400 mb-8">Best Time: {highScore}ms</p>
            )}
            <StyledButton onClick={startGame}>Start Game</StyledButton>
          </div>
        );
      case 'ready':
        return (
          <div className="w-full h-64 bg-red-500 rounded-lg flex items-center justify-center cursor-pointer transition-colors duration-200" onClick={handleBoxClick}>
            <p className="text-3xl font-bold text-white animate-pulse">Wait for Green...</p>
          </div>
        );
      case 'active':
        return (
          <div className="w-full h-64 bg-emerald-400 rounded-lg flex items-center justify-center cursor-pointer animate-pulse-glow-emerald" onClick={handleBoxClick}>
            <p className="text-5xl font-bold text-white" style={{animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1)'}}>CLICK!</p>
          </div>
        );
      case 'result':
        return (
          <div className="text-center animate-fade-in-up">
             {isNewHighScore && (
                <p className="text-3xl font-bold text-yellow-400 mb-4 animate-bounce">New High Score!</p>
             )}
             {score === -1 ? (
                <h2 className="text-4xl font-bold text-red-500 mb-4">Too Soon!</h2>
             ) : (
                <h2 className="text-4xl font-bold mb-4">Your Time: <span className="text-cyan-400 animate-score-pop">{score}ms</span></h2>
             )}
            <p className="text-slate-400 mb-8">Best: {highScore}ms. Can you beat it?</p>
            <StyledButton onClick={startGame}>Play Again</StyledButton>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-2xl mx-auto">
      {renderContent()}
      <div className="mt-12">
        <button onClick={onBack} className="text-slate-400 hover:text-cyan-400 transition-colors">
          &larr; Back to Menu
        </button>
      </div>
    </div>
  );
};

export default ReactionTimeGame;