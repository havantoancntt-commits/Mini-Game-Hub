import React, { useState, useEffect, useRef } from 'react';
import useInterval from '../../hooks/useInterval';
import StyledButton from '../StyledButton';
import useLocalStorage from '../../hooks/useLocalStorage';
import { playSuccessSound, playErrorSound, playWinSound } from '../../utils/audio';

interface BrickBreakerGameProps {
  onBack: () => void;
}

const GAME_WIDTH = 500;
const GAME_HEIGHT = 600;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 20;
const BALL_RADIUS = 10;

const BrickBreakerGame: React.FC<BrickBreakerGameProps> = ({ onBack }) => {
  const [paddleX, setPaddleX] = useState((GAME_WIDTH - PADDLE_WIDTH) / 2);
  const [ball, setBall] = useState({ x: GAME_WIDTH / 2, y: GAME_HEIGHT - 50, dx: 4, dy: -4 });
  const [bricks, setBricks] = useState<any[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'over' | 'win'>('start');
  const [highScore, setHighScore] = useLocalStorage('brick-breaker-hs', 0);
  
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const resetBricks = () => {
    const newBricks = [];
    const brickRows = 5;
    const brickCols = 8;
    const brickWidth = 50;
    const brickHeight = 20;
    const brickPadding = 10;
    const brickOffsetTop = 30;
    const brickOffsetLeft = 30;

    for (let c = 0; c < brickCols; c++) {
      for (let r = 0; r < brickRows; r++) {
        newBricks.push({
          x: c * (brickWidth + brickPadding) + brickOffsetLeft,
          y: r * (brickHeight + brickPadding) + brickOffsetTop,
          width: brickWidth,
          height: brickHeight,
          status: 1,
        });
      }
    }
    setBricks(newBricks);
  };

  const resetGame = () => {
    resetBricks();
    setScore(0);
    setLives(3);
    setBall({ x: GAME_WIDTH / 2, y: GAME_HEIGHT - 50, dx: 4, dy: -4 });
    setPaddleX((GAME_WIDTH - PADDLE_WIDTH) / 2);
    setGameState('playing');
  };
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        if (gameAreaRef.current) {
            const relativeX = e.clientX - gameAreaRef.current.getBoundingClientRect().left;
            if (relativeX > 0 && relativeX < GAME_WIDTH) {
                let newPaddleX = relativeX - PADDLE_WIDTH / 2;
                if (newPaddleX < 0) newPaddleX = 0;
                if (newPaddleX > GAME_WIDTH - PADDLE_WIDTH) newPaddleX = GAME_WIDTH - PADDLE_WIDTH;
                setPaddleX(newPaddleX);
            }
        }
    };
    if (gameState === 'playing') {
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [gameState]);


  const gameLoop = () => {
    if (gameState !== 'playing') return;

    let newBall = { ...ball };

    // Wall collision
    if (newBall.x + newBall.dx > GAME_WIDTH - BALL_RADIUS || newBall.x + newBall.dx < BALL_RADIUS) {
      newBall.dx = -newBall.dx;
    }
    if (newBall.y + newBall.dy < BALL_RADIUS) {
      newBall.dy = -newBall.dy;
    } else if (newBall.y + newBall.dy > GAME_HEIGHT - BALL_RADIUS) {
      // Paddle collision
      if (newBall.x > paddleX && newBall.x < paddleX + PADDLE_WIDTH) {
        newBall.dy = -newBall.dy;
        playClickSound();
      } else {
        // Lost a life
        setLives(l => l - 1);
        playErrorSound();
        if (lives - 1 <= 0) {
          setGameState('over');
          if (score > highScore) setHighScore(score);
        } else {
          newBall = { x: GAME_WIDTH / 2, y: GAME_HEIGHT - 50, dx: 4, dy: -4 };
        }
      }
    }

    // Brick collision
    const newBricks = [...bricks];
    let allBricksBroken = true;
    newBricks.forEach(brick => {
      if (brick.status === 1) {
        allBricksBroken = false;
        if (
          newBall.x > brick.x &&
          newBall.x < brick.x + brick.width &&
          newBall.y > brick.y &&
          newBall.y < brick.y + brick.height
        ) {
          newBall.dy = -newBall.dy;
          brick.status = 0;
          setScore(s => s + 10);
          playSuccessSound();
        }
      }
    });
    setBricks(newBricks);
    
    if (allBricksBroken && bricks.length > 0) {
        playWinSound();
        setGameState('win');
        if (score > highScore) setHighScore(score);
    }


    newBall.x += newBall.dx;
    newBall.y += newBall.dy;
    setBall(newBall);
  };

  useInterval(gameLoop, 1000 / 60);

  const renderMessage = () => {
    let message = { title: '', body: '', button: ''};
    if (gameState === 'start') {
        message = { title: "Brick Breaker", body: `You have ${lives} lives. Clear all bricks!`, button: 'Start Game' };
    } else if (gameState === 'over') {
        message = { title: "Game Over", body: `Your score: ${score}`, button: 'Play Again' };
    } else if (gameState === 'win') {
        message = { title: "You Win!", body: `Final score: ${score}`, button: 'Play Again' };
    } else return null;

    return (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center z-20 animate-fade-in">
            <h2 className="text-4xl font-extrabold mb-4">{message.title}</h2>
            <p className="text-xl mb-6">{message.body}</p>
            <StyledButton onClick={resetGame}>{message.button}</StyledButton>
        </div>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex justify-between w-full max-w-lg text-xl font-bold text-slate-300">
        <div>Score: <span className="text-white">{score}</span></div>
        <div>Lives: <span className="text-white">{lives}</span></div>
        <div>Best: <span className="text-yellow-400">{highScore}</span></div>
      </div>
      <div ref={gameAreaRef} className="bg-slate-900 overflow-hidden relative border-2 border-slate-700" style={{ width: GAME_WIDTH, height: GAME_HEIGHT, cursor: 'none' }}>
        {renderMessage()}

        <div className="absolute bg-cyan-400" style={{
            left: paddleX,
            bottom: 10,
            width: PADDLE_WIDTH,
            height: PADDLE_HEIGHT,
            borderRadius: '5px'
        }} />

        <div className="absolute bg-fuchsia-400 rounded-full" style={{
            left: ball.x - BALL_RADIUS,
            top: ball.y - BALL_RADIUS,
            width: BALL_RADIUS * 2,
            height: BALL_RADIUS * 2
        }} />

        {bricks.map((brick, index) => (
            brick.status === 1 && <div key={index} className="absolute bg-slate-600" style={{
                left: brick.x,
                top: brick.y,
                width: brick.width,
                height: brick.height,
                borderRadius: '3px'
            }} />
        ))}

      </div>
       <div className="mt-8">
            <button onClick={onBack} className="text-slate-400 hover:text-cyan-400 transition-colors">
            &larr; Back to Menu
            </button>
        </div>
    </div>
  );
};

export default BrickBreakerGame;
