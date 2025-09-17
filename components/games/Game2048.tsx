import React, { useState, useEffect, useCallback } from 'react';
import StyledButton from '../StyledButton';
import useLocalStorage from '../../hooks/useLocalStorage';
import { playSuccessSound, playWinSound, playGameOverSound } from '../../utils/audio';

interface Game2048Props {
  onBack: () => void;
}

const GRID_SIZE = 4;

type Grid = number[][];

const Game2048: React.FC<Game2048Props> = ({ onBack }) => {
  const [grid, setGrid] = useState<Grid>(() => createEmptyGrid());
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [highScore, setHighScore] = useLocalStorage('2048-hs', 0);

  function createEmptyGrid(): Grid {
    return Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(0));
  }

  const addNumber = useCallback((grid: Grid): Grid => {
    const newGrid = grid.map(row => [...row]);
    const emptyCells: {r: number, c: number}[] = [];
    for(let r = 0; r < GRID_SIZE; r++) {
        for(let c = 0; c < GRID_SIZE; c++) {
            if(newGrid[r][c] === 0) {
                emptyCells.push({r, c});
            }
        }
    }
    
    if (emptyCells.length > 0) {
        const {r, c} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        newGrid[r][c] = Math.random() > 0.9 ? 4 : 2;
    }

    return newGrid;
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

  const resetGame = useCallback(() => {
    let newGrid = createEmptyGrid();
    newGrid = addNumber(newGrid);
    newGrid = addNumber(newGrid);
    setGrid(newGrid);
    setScore(0);
    setIsGameOver(false);
  }, [addNumber]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const move = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    if (isGameOver) return;
    
    let moved = false;
    let tempGrid = grid.map(row => [...row]);
    let newScore = score;
    
    const slide = (row: number[]) => {
      let arr = row.filter(val => val);
      let missing = GRID_SIZE - arr.length;
      let zeros = Array(missing).fill(0);
      return arr.concat(zeros);
    };

    const combine = (row: number[]) => {
      for (let i = 0; i < GRID_SIZE - 1; i++) {
        if (row[i] !== 0 && row[i] === row[i + 1]) {
          row[i] *= 2;
          newScore += row[i];
          row[i + 1] = 0;
          moved = true; // This should be inside combine to detect merges
          playSuccessSound();
        }
      }
      return row;
    };
    
    const rotateRight = (matrix: Grid) => {
        let result = createEmptyGrid();
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                result[c][GRID_SIZE - 1 - r] = matrix[r][c];
            }
        }
        return result;
    };
    
    const isChanged = (original: Grid, newGrid: Grid) => {
      for (let r = 0; r < GRID_SIZE; r++) {
        for (let c = 0; c < GRID_SIZE; c++) {
          if (original[r][c] !== newGrid[r][c]) return true;
        }
      }
      return false;
    };

    const operate = (grid: Grid) => {
        return grid.map(row => {
            const originalRow = [...row];
            let newRow = slide(row);
            newRow = combine(newRow);
            newRow = slide(newRow);
            if (!moved) {
                moved = originalRow.join(',') !== newRow.join(',');
            }
            return newRow;
        });
    };

    if (direction === 'left') {
        tempGrid = operate(tempGrid);
    } else if (direction === 'right') {
        tempGrid = tempGrid.map(row => row.reverse());
        tempGrid = operate(tempGrid);
        tempGrid = tempGrid.map(row => row.reverse());
    } else if (direction === 'up') {
        tempGrid = rotateRight(rotateRight(rotateRight(tempGrid)));
        tempGrid = operate(tempGrid);
        tempGrid = rotateRight(tempGrid);
    } else if (direction === 'down') {
        tempGrid = rotateRight(tempGrid);
        tempGrid = operate(tempGrid);
        tempGrid = rotateRight(rotateRight(rotateRight(tempGrid)));
    }

    if (moved) {
      const newGridWithNumber = addNumber(tempGrid);
      setGrid(newGridWithNumber);
      setScore(newScore);
      if(newScore > highScore) {
        setHighScore(newScore);
      }
      if (checkGameOver(newGridWithNumber)) {
          setIsGameOver(true);
          playGameOverSound();
      }
    }
  }, [grid, isGameOver, score, highScore, setHighScore, addNumber]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      switch (e.key) {
        case 'ArrowUp': move('up'); break;
        case 'ArrowDown': move('down'); break;
        case 'ArrowLeft': move('left'); break;
        case 'ArrowRight': move('right'); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  const getTileColor = (value: number) => {
    const baseStyle = 'shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] ';
    switch (value) {
      case 2: return baseStyle + 'bg-slate-700';
      case 4: return baseStyle + 'bg-slate-600';
      case 8: return baseStyle + 'bg-cyan-800 text-slate-100';
      case 16: return baseStyle + 'bg-cyan-700 text-slate-100';
      case 32: return baseStyle + 'bg-cyan-600 text-slate-100';
      case 64: return baseStyle + 'bg-cyan-500 text-slate-100';
      case 128: return baseStyle + 'bg-fuchsia-800 text-slate-100';
      case 256: return baseStyle + 'bg-fuchsia-700 text-slate-100';
      case 512: return baseStyle + 'bg-fuchsia-600 text-slate-100';
      case 1024: return baseStyle + 'bg-yellow-500 text-slate-900';
      case 2048: return baseStyle + 'bg-yellow-400 text-slate-900 animate-pulse-glow-yellow';
      default: return 'bg-slate-800';
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 flex justify-between w-full max-w-sm text-xl font-bold text-slate-300">
        <div>Score: <span className="text-white animate-score-pop" key={score}>{score}</span></div>
        <div>Best: <span className="text-yellow-400">{highScore}</span></div>
      </div>
      <div className="bg-slate-700 p-2 rounded-lg relative">
        {isGameOver && (
          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center z-10 animate-fade-in">
            <h2 className="text-4xl font-extrabold text-red-500 mb-4">Game Over</h2>
            <StyledButton onClick={resetGame}>Play Again</StyledButton>
          </div>
        )}
        {grid.map((row, rIndex) => (
          <div key={rIndex} className="flex gap-2 mb-2 last:mb-0">
            {row.map((cell, cIndex) => (
              <div key={cIndex} className={`w-20 h-20 sm:w-24 sm:h-24 rounded-md flex items-center justify-center text-3xl sm:text-4xl font-bold transition-all duration-200 ${getTileColor(cell)}`}>
                {cell > 0 && cell}
              </div>
            ))}
          </div>
        ))}
      </div>
       <div className="mt-8">
        <StyledButton onClick={resetGame}>New Game</StyledButton>
      </div>
      <div className="mt-8 text-center text-slate-400">
        <p>Use Arrow Keys to move tiles.</p>
      </div>
      <div className="mt-8">
        <button onClick={onBack} className="text-slate-400 hover:text-cyan-400 transition-colors">
          &larr; Back to Menu
        </button>
      </div>
    </div>
  );
};

export default Game2048;