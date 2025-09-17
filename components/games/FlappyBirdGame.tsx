import React, { useState, useEffect, useRef } from 'react';
import useInterval from '../../hooks/useInterval';
import StyledButton from '../StyledButton';
import useLocalStorage from '../../hooks/useLocalStorage';
import { playJumpSound, playGameOverSound } from '../../utils/audio';

interface FlappyBirdGameProps {
  onBack: () => void;
  onNewHighScore: (gameName: string, score: number) => void;
}

const LOGICAL_WIDTH = 500;
const LOGICAL_HEIGHT = 600;
const BIRD_SIZE = 30;
const GRAVITY = 0.6;
const JUMP_STRENGTH = -10;
const PIPE_WIDTH = 60;
const PIPE_GAP = 200;
const PIPE_SPEED = -4;
const PIPE_INTERVAL = 1500; // ms

const FlappyBirdGame: React.FC<FlappyBirdGameProps> = ({ onBack, onNewHighScore }) => {
  const [birdPosition, setBirdPosition] = useState(LOGICAL_HEIGHT / 2);
  const [birdVelocity, setBirdVelocity] = useState(0);
  const [pipes, setPipes] = useState<{ x: number; topHeight: number }[]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useLocalStorage('flappy-bird-highscore', 0);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'over'>('idle');
  // Fix: Initialize useRef with null and use the correct 'number' type for browser setInterval.
  const pipeTimerRef = useRef<number | null>(null);
  const scoreKey = React.useMemo(() => Date.now(), [score]);

  const resetGame = () => {
    setBirdPosition(LOGICAL_HEIGHT / 2);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setGameState('idle');
    if(pipeTimerRef.current) window.clearInterval(pipeTimerRef.current);
    pipeTimerRef.current = null;
  };

  const startGame = () => {
    setBirdPosition(LOGICAL_HEIGHT / 2);
    setBirdVelocity(0);
    setPipes([]);
    setScore(0);
    setGameState('playing');
    pipeTimerRef.current = window.setInterval(() => {
        setPipes(prev => [
            ...prev,
            {
                x: LOGICAL_WIDTH,
                topHeight: Math.random() * (LOGICAL_HEIGHT - PIPE_GAP - 100) + 50,
            },
        ]);
    }, PIPE_INTERVAL);
  };
  
  const gameOver = () => {
    playGameOverSound();
    setGameState('over');
    if (pipeTimerRef.current) window.clearInterval(pipeTimerRef.current);
    pipeTimerRef.current = null;
    if (score > highScore) {
        setHighScore(score);
        onNewHighScore('Flappy Bird', score);
    }
  }

  const gameLoop = () => {
    if (gameState !== 'playing') return;

    // Bird physics
    let newVelocity = birdVelocity + GRAVITY;
    let newPosition = birdPosition + newVelocity;
    
    // Floor collision
    if (newPosition > LOGICAL_HEIGHT - BIRD_SIZE) {
        newPosition = LOGICAL_HEIGHT - BIRD_SIZE;
        gameOver();
    }
    
    // Ceiling collision
    if (newPosition < 0) {
        newPosition = 0;
        newVelocity = 0;
    }

    setBirdVelocity(newVelocity);
    setBirdPosition(newPosition);

    // Pipe movement & scoring
    let scored = false;
    const birdCenterX = LOGICAL_WIDTH / 2;
    const newPipes = pipes.map(pipe => {
        const newX = pipe.x + PIPE_SPEED;
        if (!scored && pipe.x > birdCenterX && newX <= birdCenterX) {
            setScore(s => s + 1);
            scored = true;
        }
        return { ...pipe, x: newX };
    }).filter(pipe => pipe.x > -PIPE_WIDTH);
    setPipes(newPipes);

    // Pipe collision
    const birdLeft = LOGICAL_WIDTH / 2 - BIRD_SIZE / 2;
    const birdRight = LOGICAL_WIDTH / 2 + BIRD_SIZE / 2;
    for (const pipe of pipes) {
        const pipeLeft = pipe.x;
        const pipeRight = pipe.x + PIPE_WIDTH;
        const pipeTop = pipe.topHeight;
        const pipeBottom = pipe.topHeight + PIPE_GAP;

        if (birdRight > pipeLeft && birdLeft < pipeRight) {
            if (birdPosition < pipeTop || birdPosition + BIRD_SIZE > pipeBottom) {
                gameOver();
                return;
            }
        }
    }
  };
  
  const jump = () => {
    if (gameState === 'playing') {
      setBirdVelocity(JUMP_STRENGTH);
      playJumpSound();
    } else if (gameState === 'idle') {
      startGame();
    } else if (gameState === 'over') {
      resetGame();
    }
  };

  useInterval(gameLoop, 20);
  
  useEffect(() => {
    // Cleanup interval on unmount
    return () => {
        if(pipeTimerRef.current) window.clearInterval(pipeTimerRef.current);
    }
  }, []);

  return (
    <div className="flex flex-col items-center p-6 sm:p-8 w-full max-w-lg mx-auto text-center bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-700/50 animate-fade-in-up">
      <h2 className="text-4xl font-bold mb-2">Flappy Bird</h2>
      <p className="text-slate-400 mb-4">Click or press Space to flap.</p>
       <div className="flex gap-8 mb-4">
          <p>Score: <span key={scoreKey} className="font-bold text-cyan-400 animate-score-pop">{score}</span></p>
          <p>High Score: <span className="font-bold text-yellow-400">{highScore}</span></p>
      </div>

      <div
        className="bg-sky-800/80 border-2 border-slate-600 relative overflow-hidden cursor-pointer w-full aspect-[5/6] rounded-lg"
        onClick={jump}
        tabIndex={0}
        onKeyDown={(e) => e.key === ' ' && jump()}
      >
        {(gameState === 'idle' || gameState === 'over') && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-20">
            <h3 className="text-3xl font-bold text-white mb-4">{gameState === 'over' ? 'Game Over' : 'Ready?'}</h3>
            <StyledButton onClick={(e) => { e.stopPropagation(); jump(); }}>
                {gameState === 'over' ? 'Try Again' : 'Start Game'}
            </StyledButton>
            </div>
        )}

        <div
          className="absolute bg-yellow-400 rounded-full"
          style={{ 
            left: `calc(${(LOGICAL_WIDTH / 2 - BIRD_SIZE / 2) / LOGICAL_WIDTH * 100}% )`,
            top: `${(birdPosition / LOGICAL_HEIGHT) * 100}%`, 
            width: `${(BIRD_SIZE / LOGICAL_WIDTH) * 100}%`, 
            height: `${(BIRD_SIZE / LOGICAL_HEIGHT) * 100}%`,
            transition: 'top 20ms linear',
            filter: 'drop-shadow(0 0 5px rgba(255,255,0,0.7))'
          }}
        />

        {pipes.map((pipe, index) => (
          <React.Fragment key={index}>
            {/* Top pipe */}
            <div
              className="absolute bg-green-500 border-2 border-green-700"
              style={{ 
                  left: `${(pipe.x / LOGICAL_WIDTH) * 100}%`, 
                  top: 0, 
                  width: `${(PIPE_WIDTH / LOGICAL_WIDTH) * 100}%`, 
                  height: `${(pipe.topHeight / LOGICAL_HEIGHT) * 100}%`, 
                  filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.5))' 
                }}
            />
            {/* Bottom pipe */}
            <div
              className="absolute bg-green-500 border-2 border-green-700"
              style={{ 
                  left: `${(pipe.x / LOGICAL_WIDTH) * 100}%`, 
                  top: `${((pipe.topHeight + PIPE_GAP) / LOGICAL_HEIGHT) * 100}%`, 
                  width: `${(PIPE_WIDTH / LOGICAL_WIDTH) * 100}%`, 
                  bottom: 0,
                  filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.5))' 
                }}
            />
          </React.Fragment>
        ))}
      </div>

      <button onClick={onBack} className="group mt-12 text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        <span>Back to Menu</span>
      </button>
    </div>
  );
};

export default FlappyBirdGame;