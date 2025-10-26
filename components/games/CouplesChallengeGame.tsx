import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import StyledButton from '../StyledButton';
import useLocalStorage from '../../hooks/useLocalStorage';
import { playJumpSound, playGameOverSound } from '../../utils/audio';

// Props
interface ImpossibleJumpGameProps {
  onBack: () => void;
}

// Constants
const GAME_WIDTH = 500;
const GAME_HEIGHT = 600;
const PLAYER_SIZE = 30;
const GRAVITY = 0.7;
const JUMP_STRENGTH = -13;
const GROUND_Y = GAME_HEIGHT - PLAYER_SIZE;
const OBSTACLE_WIDTH = 40;
const MIN_OBSTACLE_HEIGHT = 30;
const MAX_OBSTACLE_HEIGHT = 100;
const OBSTACLE_GAP = 220;
const GAME_SPEED = -5;

const CouplesChallengeGame: React.FC<ImpossibleJumpGameProps> = ({ onBack }) => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'over'>('idle');
  const [playerY, setPlayerY] = useState(GROUND_Y);
  const [playerVelY, setPlayerVelY] = useState(0);
  const [obstacles, setObstacles] = useState<{ x: number; height: number; scored?: boolean }[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useLocalStorage('impossible-jump-highscore', 0);
  const gameLoopRef = useRef<number>();
  const scoreKey = useMemo(() => Date.now(), [score]);

  const resetGame = useCallback(() => {
    setPlayerY(GROUND_Y);
    setPlayerVelY(0);
    setScore(0);
    const initialObstacles = [];
    for (let i = 0; i < 3; i++) {
        initialObstacles.push({
            x: GAME_WIDTH + i * OBSTACLE_GAP,
            height: MIN_OBSTACLE_HEIGHT + Math.random() * (MAX_OBSTACLE_HEIGHT - MIN_OBSTACLE_HEIGHT)
        });
    }
    setObstacles(initialObstacles);
  }, []);
  
  const startGame = () => {
    resetGame();
    setGameState('playing');
  };

  const jump = useCallback(() => {
    if (gameState === 'playing' && playerY >= GROUND_Y) {
      setPlayerVelY(JUMP_STRENGTH);
      playJumpSound();
    }
  }, [gameState, playerY]);
  
  const handleGameInteraction = useCallback(() => {
    if (gameState === 'idle' || gameState === 'over') startGame();
    else if (gameState === 'playing') jump();
  }, [gameState, jump]);

  const gameLoop = useCallback(() => {
    setPlayerY(y => {
      const newVelY = playerVelY + GRAVITY;
      setPlayerVelY(newVelY);
      const newY = y + newVelY;
      return newY >= GROUND_Y ? GROUND_Y : newY;
    });

    let scoredThisFrame = false;
    setObstacles(prevObstacles => {
      const newObstacles = prevObstacles.map(obs => ({...obs, x: obs.x + GAME_SPEED}))
        .filter(obs => obs.x > -OBSTACLE_WIDTH);

      const playerX = GAME_WIDTH / 4;
      newObstacles.forEach(obs => {
        if (!obs.scored && obs.x + OBSTACLE_WIDTH < playerX) {
          if (!scoredThisFrame) {
            setScore(s => s + 1);
            scoredThisFrame = true;
          }
          obs.scored = true;
        }
      });

      const lastObstacle = newObstacles[newObstacles.length - 1];
      if (lastObstacle && lastObstacle.x < GAME_WIDTH - OBSTACLE_GAP) {
        newObstacles.push({
          x: lastObstacle.x + OBSTACLE_GAP + (Math.random() * 60 - 30),
          height: MIN_OBSTACLE_HEIGHT + Math.random() * (MAX_OBSTACLE_HEIGHT - MIN_OBSTACLE_HEIGHT),
        });
      }
      return newObstacles;
    });

    const playerRect = { x: GAME_WIDTH / 4 - PLAYER_SIZE / 2, y: playerY, width: PLAYER_SIZE, height: PLAYER_SIZE };
    for (const obs of obstacles) {
      const obsRect = { x: obs.x, y: GAME_HEIGHT - obs.height, width: OBSTACLE_WIDTH, height: obs.height };
      if (playerRect.x < obsRect.x + obsRect.width && playerRect.x + playerRect.width > obsRect.x &&
          playerRect.y < obsRect.y + obsRect.height && playerRect.y + playerRect.height > obsRect.y) {
        setGameState('over');
        playGameOverSound();
        if (score > highScore) setHighScore(score);
        return;
      }
    }
    gameLoopRef.current = requestAnimationFrame(gameLoop);
  }, [playerY, playerVelY, obstacles, score, highScore, setHighScore]);
  
  useEffect(() => {
    if (gameState === 'playing') gameLoopRef.current = requestAnimationFrame(gameLoop);
    return () => { if (gameLoopRef.current) cancelAnimationFrame(gameLoopRef.current); };
  }, [gameState, gameLoop]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        handleGameInteraction();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGameInteraction]);

  return (
    <div className="flex flex-col items-center p-4 sm:p-6 w-full h-full text-center">
      <h2 className="text-3xl sm:text-4xl font-black mb-1 text-red-500 tracking-tighter">THE IMPOSSIBLE JUMP</h2>
      <p className="text-slate-400 mb-4">Click or press Space to jump. Survive.</p>
      <div className="flex gap-8 mb-4">
        <p aria-live="polite">Score: <span key={scoreKey} className="font-bold text-cyan-400 animate-score-pop text-2xl">{score}</span></p>
        <p>High Score: <span className="font-bold text-yellow-400 text-2xl">{highScore}</span></p>
      </div>
      
      <div className="bg-slate-900/80 border-2 border-slate-700 relative overflow-hidden cursor-pointer w-full flex-grow rounded-lg" onClick={handleGameInteraction} tabIndex={0} style={{ minHeight: '300px'}}>
        {(gameState === 'idle' || gameState === 'over') && (
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-20">
            <h3 className="text-3xl font-bold text-white mb-4">{gameState === 'over' ? 'Game Over' : 'Ready?'}</h3>
            <StyledButton onClick={e => { e.stopPropagation(); startGame(); }}>
              {gameState === 'over' ? 'Try Again' : 'Start'}
            </StyledButton>
          </div>
        )}
        <div className="absolute bg-cyan-400" style={{
          left: `${(GAME_WIDTH / 4 - PLAYER_SIZE / 2) / GAME_WIDTH * 100}%`, top: `${playerY / GAME_HEIGHT * 100}%`,
          width: `${PLAYER_SIZE / GAME_WIDTH * 100}%`, height: `${PLAYER_SIZE / GAME_HEIGHT * 100}%`,
          boxShadow: '0 0 15px hsl(188, 95%, 41%)', transition: 'top 16ms linear'
        }}/>
        {obstacles.map((obs, index) => (
          <div key={index} className="absolute bottom-0 bg-red-600 border-t-2 border-red-400" style={{
            left: `${obs.x / GAME_WIDTH * 100}%`, width: `${OBSTACLE_WIDTH / GAME_WIDTH * 100}%`,
            height: `${obs.height / GAME_HEIGHT * 100}%`, boxShadow: '0 0 15px hsl(350, 80%, 50%)'
          }}/>
        ))}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-400" />
      </div>

      <button onClick={onBack} className="group mt-8 text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        <span>Back to Menu</span>
      </button>
    </div>
  );
};

export default CouplesChallengeGame;