import React, { useState, useEffect, useRef } from 'react';
import StyledButton from '../StyledButton';
import useLocalStorage from '../../hooks/useLocalStorage';
import useInterval from '../../hooks/useInterval';

interface BrickBreakerGameProps {
  onBack: () => void;
  onNewHighScore: (gameName: string, score: number) => void;
}

const LOGICAL_WIDTH = 500;
const LOGICAL_HEIGHT = 600;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 20;
const BALL_RADIUS = 10;
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_HEIGHT = 20;
const BRICK_GAP = 5;

type Brick = { x: number; y: number; w: number; active: boolean };

const BrickBreakerGame: React.FC<BrickBreakerGameProps> = ({ onBack, onNewHighScore }) => {
  const [paddleX, setPaddleX] = useState(LOGICAL_WIDTH / 2 - PADDLE_WIDTH / 2);
  const [ball, setBall] = useState({ x: LOGICAL_WIDTH / 2, y: LOGICAL_HEIGHT - 50, dx: 4, dy: -4 });
  const [bricks, setBricks] = useState<Brick[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'over'>('idle');
  const [highScore, setHighScore] = useLocalStorage('brick-breaker-highscore', 0);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const scoreKey = React.useMemo(() => Date.now(), [score]);

  const createBricks = () => {
    const newBricks: Brick[] = [];
    const brickWidth = (LOGICAL_WIDTH - (BRICK_COLS + 1) * BRICK_GAP) / BRICK_COLS;
    for (let r = 0; r < BRICK_ROWS; r++) {
      for (let c = 0; c < BRICK_COLS; c++) {
        newBricks.push({
          x: c * (brickWidth + BRICK_GAP) + BRICK_GAP,
          y: r * (BRICK_HEIGHT + BRICK_GAP) + BRICK_GAP + 50,
          w: brickWidth,
          active: true
        });
      }
    }
    setBricks(newBricks);
  };
  
  const resetBallAndPaddle = () => {
    setPaddleX(LOGICAL_WIDTH / 2 - PADDLE_WIDTH / 2);
    setBall({ x: LOGICAL_WIDTH / 2, y: LOGICAL_HEIGHT - 50, dx: 4, dy: -4 });
  };
  
  const resetGame = () => {
    createBricks();
    resetBallAndPaddle();
    setScore(0);
    setLives(3);
    setGameState('idle');
  }

  const startGame = () => {
      if (gameState === 'idle' || gameState === 'over') {
          resetGame();
          setGameState('playing');
      }
  }
  
  const gameOver = () => {
      setGameState('over');
      if (score > highScore) {
          setHighScore(score);
          onNewHighScore('Brick Breaker', score);
      }
  }

  useEffect(() => {
    createBricks();
  }, []);

  const gameLoop = () => {
    if (gameState !== 'playing') return;

    let newBall = { ...ball };
    newBall.x += newBall.dx;
    newBall.y += newBall.dy;

    // Wall collision
    if (newBall.x < BALL_RADIUS || newBall.x > LOGICAL_WIDTH - BALL_RADIUS) newBall.dx *= -1;
    if (newBall.y < BALL_RADIUS) newBall.dy *= -1;

    // Paddle collision
    if (newBall.y > LOGICAL_HEIGHT - PADDLE_HEIGHT - BALL_RADIUS && 
        newBall.x > paddleX && newBall.x < paddleX + PADDLE_WIDTH) {
        newBall.dy *= -1;
        newBall.y = LOGICAL_HEIGHT - PADDLE_HEIGHT - BALL_RADIUS; // prevent sticking
    }

    // Bottom wall (lose life)
    if (newBall.y > LOGICAL_HEIGHT - BALL_RADIUS) {
        const newLives = lives - 1;
        setLives(newLives);
        if (newLives > 0) {
            resetBallAndPaddle();
        } else {
            gameOver();
        }
        return;
    }

    // Brick collision
    let hitBrick = false;
    const newBricks = bricks.map(brick => {
        if (!brick.active) return brick;
        if (newBall.x + BALL_RADIUS > brick.x && newBall.x - BALL_RADIUS < brick.x + brick.w &&
            newBall.y + BALL_RADIUS > brick.y && newBall.y - BALL_RADIUS < brick.y + BRICK_HEIGHT) {
            
            if (!hitBrick) {
              newBall.dy *= -1;
              hitBrick = true;
            }
            setScore(s => s + 10);
            return { ...brick, active: false };
        }
        return brick;
    });

    setBricks(newBricks);
    setBall(newBall);

    if (newBricks.length > 0 && newBricks.every(b => !b.active)) {
        // You win! (or next level)
        gameOver();
    }
  };

  useInterval(gameLoop, 16); // ~60fps

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
        if (!gameAreaRef.current) return;
        const rect = gameAreaRef.current.getBoundingClientRect();
        const scaleX = LOGICAL_WIDTH / rect.width;
        const mouseXInGame = (e.clientX - rect.left) * scaleX;
        const newPaddleX = mouseXInGame - PADDLE_WIDTH / 2;
        setPaddleX(Math.max(0, Math.min(LOGICAL_WIDTH - PADDLE_WIDTH, newPaddleX)));
    };
    const gameDiv = gameAreaRef.current;
    if (gameDiv && gameState === 'playing') {
        gameDiv.addEventListener('mousemove', handleMouseMove);
    }
    return () => gameDiv?.removeEventListener('mousemove', handleMouseMove);
  }, [gameState]);


  return (
    <div className="flex flex-col items-center p-6 sm:p-8 w-full max-w-lg mx-auto text-center bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-700/50 animate-fade-in-up">
      <h2 className="text-4xl font-bold mb-2">Brick Breaker</h2>
      <p className="text-slate-400 mb-4">Move your mouse to control the paddle.</p>
       <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-4 text-lg sm:text-xl">
          <p>Score: <span key={scoreKey} className="font-bold text-cyan-400 animate-score-pop">{score}</span></p>
          <p>Lives: <span className="font-bold text-red-400">{lives}</span></p>
          <p>High Score: <span className="font-bold text-yellow-400">{highScore}</span></p>
      </div>

      <div
        ref={gameAreaRef}
        className="bg-slate-900/80 border-2 border-slate-600 relative overflow-hidden w-full aspect-[5/6] rounded-lg"
      >
         {(gameState !== 'playing') && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center z-20 rounded-lg">
            <h3 className="text-3xl font-bold text-white mb-4">
                {gameState === 'over' ? `Game Over! Score: ${score}` : 'Ready?'}
            </h3>
            <StyledButton onClick={startGame}>
                {gameState === 'over' ? 'Play Again' : 'Start Game'}
            </StyledButton>
            </div>
        )}

        {/* Paddle */}
        <div 
          className="absolute bg-cyan-400"
          style={{ 
            left: `${paddleX / LOGICAL_WIDTH * 100}%`,
            bottom: 0,
            width: `${PADDLE_WIDTH / LOGICAL_WIDTH * 100}%`,
            height: `${PADDLE_HEIGHT / LOGICAL_HEIGHT * 100}%`,
            filter: 'drop-shadow(0 0 10px rgba(0, 255, 255, 0.7))'
          }} 
        />
        {/* Ball */}
        <div
          className="absolute bg-white rounded-full"
          style={{ 
            left: `${(ball.x - BALL_RADIUS) / LOGICAL_WIDTH * 100}%`,
            top: `${(ball.y - BALL_RADIUS) / LOGICAL_HEIGHT * 100}%`,
            width: `${(BALL_RADIUS * 2) / LOGICAL_WIDTH * 100}%`,
            height: `${(BALL_RADIUS * 2) / LOGICAL_HEIGHT * 100}%`,
            filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.9))'
           }}
        />
        {/* Bricks */}
        {bricks.map((brick, i) => brick.active && (
            <div
                key={i}
                className="absolute bg-fuchsia-500"
                style={{
                    left: `${brick.x / LOGICAL_WIDTH * 100}%`,
                    top: `${brick.y / LOGICAL_HEIGHT * 100}%`,
                    width: `${brick.w / LOGICAL_WIDTH * 100}%`,
                    height: `${BRICK_HEIGHT / LOGICAL_HEIGHT * 100}%`
                }}
            />
        ))}

      </div>

      <button onClick={onBack} className="group mt-12 text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        <span>Back to Menu</span>
      </button>
    </div>
  );
};

export default BrickBreakerGame;