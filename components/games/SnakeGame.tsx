import React, { useState, useEffect, useCallback } from 'react';
import useInterval from '../../hooks/useInterval';
import StyledButton from '../StyledButton';
import useLocalStorage from '../../hooks/useLocalStorage';
import { playErrorSound, playSuccessSound } from '../../utils/audio';

interface SnakeGameProps {
  onBack: () => void;
}

const GRID_SIZE = 20;
const TILE_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_FOOD = { x: 15, y: 15 };
const INITIAL_DIRECTION = { x: 0, y: -1 }; // Up

const SnakeGame: React.FC<SnakeGameProps> = ({ onBack }) => {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(INITIAL_FOOD);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [speed, setSpeed] = useState<number | null>(200);
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useLocalStorage('snake-hs', 0);

  const resetGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setFood(INITIAL_FOOD);
    setDirection(INITIAL_DIRECTION);
    setSpeed(200);
    setIsGameOver(false);
    setScore(0);
  }, []);

  const generateFood = useCallback(() => {
    let newFoodPosition;
    do {
      newFoodPosition = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
    } while (snake.some(segment => segment.x === newFoodPosition.x && segment.y === newFoodPosition.y));
    setFood(newFoodPosition);
  }, [snake]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    switch (e.key) {
      case 'ArrowUp':
        if (direction.y === 0) setDirection({ x: 0, y: -1 });
        break;
      case 'ArrowDown':
        if (direction.y === 0) setDirection({ x: 0, y: 1 });
        break;
      case 'ArrowLeft':
        if (direction.x === 0) setDirection({ x: -1, y: 0 });
        break;
      case 'ArrowRight':
        if (direction.x === 0) setDirection({ x: 1, y: 0 });
        break;
    }
  }, [direction]);
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const gameLoop = () => {
    const newSnake = [...snake];
    const head = { ...newSnake[0] };
    head.x += direction.x;
    head.y += direction.y;

    // Wall collision
    if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
      setIsGameOver(true);
      setSpeed(null);
      playErrorSound();
      return;
    }
    
    // Self collision
    for (let i = 1; i < newSnake.length; i++) {
        if (head.x === newSnake[i].x && head.y === newSnake[i].y) {
            setIsGameOver(true);
            setSpeed(null);
            playErrorSound();
            return;
        }
    }

    newSnake.unshift(head);

    // Food collision
    if (head.x === food.x && head.y === food.y) {
      playSuccessSound();
      const newScore = score + 1;
      setScore(newScore);
      if (newScore > highScore) {
        setHighScore(newScore);
      }
      setSpeed(prev => (prev ? Math.max(50, prev * 0.95) : 50));
      generateFood();
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  useInterval(gameLoop, speed);

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex justify-between w-full max-w-sm text-xl font-bold text-slate-300">
        <div>Score: <span className="text-white">{score}</span></div>
        <div>Best: <span className="text-yellow-400">{highScore}</span></div>
      </div>
      <div
        className="bg-slate-800 border-2 border-slate-700 relative"
        style={{ width: GRID_SIZE * TILE_SIZE, height: GRID_SIZE * TILE_SIZE }}
      >
        {isGameOver && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center z-10 animate-fade-in">
            <h2 className="text-4xl font-extrabold text-red-500 mb-4">Game Over</h2>
            <p className="text-xl mb-6">Your score: {score}</p>
            <StyledButton onClick={resetGame}>Play Again</StyledButton>
          </div>
        )}
        {snake.map((segment, index) => (
          <div
            key={index}
            className={`absolute ${index === 0 ? 'bg-cyan-400' : 'bg-cyan-600'} rounded-sm`}
            style={{
              left: segment.x * TILE_SIZE,
              top: segment.y * TILE_SIZE,
              width: TILE_SIZE,
              height: TILE_SIZE,
            }}
          />
        ))}
        <div
          className="absolute bg-fuchsia-500 rounded-full"
          style={{
            left: food.x * TILE_SIZE,
            top: food.y * TILE_SIZE,
            width: TILE_SIZE,
            height: TILE_SIZE,
          }}
        />
      </div>
      <div className="mt-8 text-center text-slate-400">
        <p>Use Arrow Keys to move</p>
      </div>
      <div className="mt-8">
        <button onClick={onBack} className="text-slate-400 hover:text-cyan-400 transition-colors">
          &larr; Back to Menu
        </button>
      </div>
    </div>
  );
};

export default SnakeGame;
