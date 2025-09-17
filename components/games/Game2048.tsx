import React, { useState, useEffect, useCallback } from 'react';
import StyledButton from '../StyledButton';
import useLocalStorage from '../../hooks/useLocalStorage';
import { playGameOverSound } from '../../utils/audio';

interface Game2048Props {
  onBack: () => void;
  onNewHighScore: (gameName: string, score: number) => void;
}

type TileValue = number;
type Grid = TileValue[][];

const GRID_SIZE = 4;

const Game2048: React.FC<Game2048Props> = ({ onBack, onNewHighScore }) => {
  const [grid, setGrid] = useState<Grid>(() => createEmptyGrid());
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useLocalStorage('2048-highscore', 0);
  const [isGameOver, setIsGameOver] = useState(false);
  const scoreKey = React.useMemo(() => Date.now(), [score]);

  const createEmptyGrid = (): Grid => Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));

  const addRandomTile = (currentGrid: Grid): Grid => {
    let emptyTiles: { r: number; c: number }[] = [];
    currentGrid.forEach((row, r) => {
      row.forEach((val, c) => {
        if (val === 0) emptyTiles.push({ r, c });
      });
    });

    if (emptyTiles.length === 0) return currentGrid;

    const { r, c } = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
    const newGrid = currentGrid.map(row => [...row]);
    newGrid[r][c] = Math.random() < 0.9 ? 2 : 4;
    return newGrid;
  };

  const resetGame = useCallback(() => {
    let newGrid = createEmptyGrid();
    newGrid = addRandomTile(newGrid);
    newGrid = addRandomTile(newGrid);
    setGrid(newGrid);
    setScore(0);
    setIsGameOver(false);
  }, []);

  const checkGameOver = (currentGrid: Grid): boolean => {
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (currentGrid[r][c] === 0) return false;
        if (r < GRID_SIZE - 1 && currentGrid[r][c] === currentGrid[r + 1][c]) return false;
        if (c < GRID_SIZE - 1 && currentGrid[r][c] === currentGrid[r][c + 1]) return false;
      }
    }
    return true;
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (isGameOver) return;

    let direction: 'up' | 'down' | 'left' | 'right' | null = null;
    switch (e.key) {
      case 'ArrowUp': direction = 'up'; break;
      case 'ArrowDown': direction = 'down'; break;
      case 'ArrowLeft': direction = 'left'; break;
      case 'ArrowRight': direction = 'right'; break;
      default: return;
    }
    e.preventDefault();

    let oldGrid = JSON.stringify(grid);
    let newGrid = grid.map(row => [...row]);
    let newScore = score;

    const slide = (row: TileValue[]) => {
      let arr = row.filter(val => val);
      let missing = GRID_SIZE - arr.length;
      let zeros = Array(missing).fill(0);
      return arr.concat(zeros);
    };

    const combine = (row: TileValue[]) => {
      for (let i = 0; i < GRID_SIZE - 1; i++) {
        if (row[i] !== 0 && row[i] === row[i + 1]) {
          row[i] *= 2;
          newScore += row[i];
          row[i + 1] = 0;
        }
      }
      return row;
    };

    const rotateGrid = (g: Grid) => {
      let rotated = createEmptyGrid();
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          rotated[c][GRID_SIZE - 1 - r] = g[r][c];
        }
      }
      return rotated;
    };

    if (direction === 'left' || direction === 'right') {
      for (let r = 0; r < GRID_SIZE; r++) {
        let row = newGrid[r];
        if (direction === 'right') row.reverse();
        row = slide(combine(slide(row)));
        if (direction === 'right') row.reverse();
        newGrid[r] = row;
      }
    } else { // up or down
      newGrid = rotateGrid(newGrid);
      if (direction === 'down') newGrid = rotateGrid(rotateGrid(newGrid));
      for (let r = 0; r < GRID_SIZE; r++) {
        let row = newGrid[r];
        row = slide(combine(slide(row)));
        newGrid[r] = row;
      }
      if (direction === 'down') newGrid = rotateGrid(rotateGrid(newGrid));
      newGrid = rotateGrid(newGrid);
    }
    
    setScore(newScore);
    if (JSON.stringify(newGrid) !== oldGrid) {
      newGrid = addRandomTile(newGrid);
    }
    
    setGrid(newGrid);

    if (checkGameOver(newGrid)) {
        setIsGameOver(true);
        playGameOverSound();
        if(newScore > highScore) {
            setHighScore(newScore);
            onNewHighScore('2048', newScore);
        }
    }
  }, [grid, isGameOver, score, highScore, onNewHighScore, setHighScore]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const tileColors: { [key: number]: string } = {
    0: 'bg-slate-700', 2: 'bg-slate-600', 4: 'bg-slate-500',
    8: 'bg-orange-500', 16: 'bg-orange-400', 32: 'bg-red-500',
    64: 'bg-red-400', 128: 'bg-yellow-500', 256: 'bg-yellow-400',
    512: 'bg-yellow-300', 1024: 'bg-teal-500',
    2048: 'bg-teal-400 animate-pulse-glow-yellow'
  };

  return (
    <div className="flex flex-col items-center p-4 w-full max-w-md mx-auto text-center animate-fade-in-up">
      <h2 className="text-4xl font-bold mb-2">2048</h2>
      <p className="text-slate-400 mb-4">Use arrow keys to slide and combine tiles.</p>
       <div className="flex gap-8 mb-4">
          <p>Score: <span key={scoreKey} className="font-bold text-cyan-400 animate-score-pop">{score}</span></p>
          <p>High Score: <span className="font-bold text-yellow-400">{highScore}</span></p>
      </div>
      <div className="bg-slate-800 p-2 rounded-lg relative grid grid-cols-4 gap-2">
        {isGameOver && (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-10 rounded-lg">
            <h3 className="text-3xl font-bold text-red-500 mb-4">Game Over!</h3>
            <StyledButton onClick={resetGame}>Try Again</StyledButton>
          </div>
        )}
        {grid.map((row, r) =>
          row.map((val, c) => (
            <div
              key={`${r}-${c}`}
              className={`w-20 h-20 md:w-24 md:h-24 flex items-center justify-center rounded-md font-bold text-3xl
                         transition-all duration-200 shadow-inner shadow-black/20 ${tileColors[val] || 'bg-teal-300'}`}
            >
              {val > 0 && val}
            </div>
          ))
        )}
      </div>

      <button onClick={onBack} className="mt-12 text-slate-400 hover:text-cyan-400 transition-colors">
        &larr; Back to Menu
      </button>
    </div>
  );
};

export default Game2048;
