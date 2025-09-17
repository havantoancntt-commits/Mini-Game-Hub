import React, { useState, useEffect } from 'react';
import useInterval from '../../hooks/useInterval';
import StyledButton from '../StyledButton';
import useLocalStorage from '../../hooks/useLocalStorage';

interface SnakeGameProps {
  onBack: () => void;
  onNewHighScore: (gameName: string, score: number) => void;
}

const GRID_SIZE = 20;
const TILE_SIZE = 20; // in pixels

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
type Position = { x: number; y: number };

const getRandomPosition = (): Position => ({
  x: Math.floor(Math.random() * GRID_SIZE),
  y: Math.floor(Math.random() * GRID_SIZE),
});

const SnakeGame: React.FC<SnakeGameProps> = ({ onBack, onNewHighScore }) => {
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>(getRandomPosition());
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [speed, setSpeed] = useState<number | null>(200);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useLocalStorage('snake-highscore', 0);
  const scoreKey = React.useMemo(() => Date.now(), [score]);


  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood(getRandomPosition());
    setDirection('RIGHT');
    setScore(0);
    setIsGameOver(false);
    setSpeed(200);
  };

  const gameLoop = () => {
    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case 'UP': head.y -= 1; break;
      case 'DOWN': head.y += 1; break;
      case 'LEFT': head.x -= 1; break;
      case 'RIGHT': head.x += 1; break;
    }

    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      endGame();
      return;
    }

    // Self collision
    for (const segment of newSnake) {
      if (head.x === segment.x && head.y === segment.y) {
        endGame();
        return;
      }
    }

    newSnake.unshift(head);

    // Food collision
    if (head.x === food.x && head.y === food.y) {
      setScore(s => s + 1);
      // Ensure new food doesn't spawn on the snake
      let newFoodPosition;
      do {
        newFoodPosition = getRandomPosition();
      } while (newSnake.some(seg => seg.x === newFoodPosition.x && seg.y === newFoodPosition.y));
      setFood(newFoodPosition);
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };
  
  const endGame = () => {
      setIsGameOver(true);
      setSpeed(null);
      if (score > highScore) {
          setHighScore(score);
          onNewHighScore('Classic Snake', score);
      }
  }

  useInterval(gameLoop, speed);

  return (
    <div className="flex flex-col items-center p-4 w-full max-w-md mx-auto text-center animate-fade-in-up">
      <h2 className="text-4xl font-bold mb-2">Classic Snake</h2>
      <p className="text-slate-400 mb-4">Use arrow keys to move the snake.</p>
      <div className="flex gap-8 mb-4">
          <p>Score: <span key={scoreKey} className="font-bold text-cyan-400 animate-score-pop">{score}</span></p>
          <p>High Score: <span className="font-bold text-yellow-400">{highScore}</span></p>
      </div>

      <div
        className="bg-slate-800 border-2 border-slate-600 relative"
        style={{ width: GRID_SIZE * TILE_SIZE, height: GRID_SIZE * TILE_SIZE }}
      >
        {isGameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-10">
            <h3 className="text-3xl font-bold text-red-500 mb-4">Game Over</h3>
            <StyledButton onClick={resetGame}>Play Again</StyledButton>
          </div>
        )}
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`absolute ${index === 0 ? 'bg-green-400 shadow-[0_0_10px_theme(colors.green.400)]' : 'bg-green-600'}`}
            style={{ left: segment.x * TILE_SIZE, top: segment.y * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE }}
          />
        ))}
        <div
          className="absolute bg-red-500 rounded-full shadow-[0_0_10px_theme(colors.red.500)]"
          style={{ left: food.x * TILE_SIZE, top: food.y * TILE_SIZE, width: TILE_SIZE, height: TILE_SIZE }}
        />
      </div>

      <button onClick={onBack} className="mt-12 text-slate-400 hover:text-cyan-400 transition-colors">
        &larr; Back to Menu
      </button>
    </div>
  );
};

export default SnakeGame;
