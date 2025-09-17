import React, { useState, useEffect, useCallback } from 'react';
import StyledButton from '../StyledButton';
import useLocalStorage from '../../hooks/useLocalStorage';
import { playSimonSound, playGameOverSound } from '../../utils/audio';

interface SimonSaysGameProps {
  onBack: () => void;
  onNewHighScore: (gameName: string, score: number) => void;
}

const COLORS = ['green', 'red', 'yellow', 'blue'];
const DELAY = 800; // ms

const SimonSaysGame: React.FC<SimonSaysGameProps> = ({ onBack, onNewHighScore }) => {
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [gameState, setGameState] = useState<'idle' | 'showing' | 'playing' | 'over'>('idle');
  const [level, setLevel] = useState(0);
  const [highScore, setHighScore] = useLocalStorage('simon-says-highscore', 0);
  const levelKey = React.useMemo(() => Date.now(), [level]);

  const nextLevel = useCallback(() => {
    setGameState('showing');
    setPlayerSequence([]);
    const nextColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const newSequence = [...sequence, nextColor];
    setSequence(newSequence);
    setLevel(newSequence.length);

    newSequence.forEach((color, index) => {
      setTimeout(() => {
        setActiveColor(color);
        playSimonSound(color);
        setTimeout(() => {
          setActiveColor(null);
          if (index === newSequence.length - 1) {
            setGameState('playing');
          }
        }, DELAY / 2);
      }, (index + 1) * DELAY);
    });
  }, [sequence]);
  
  const startGame = () => {
    setSequence([]);
    setPlayerSequence([]);
    setLevel(0);
    setGameState('idle');
    // nextLevel is called inside useEffect when sequence becomes empty
    setTimeout(() => {
        const nextColor = COLORS[Math.floor(Math.random() * COLORS.length)];
        setSequence([nextColor]);
    }, 500)
  };

  useEffect(() => {
    if (sequence.length > 0 && gameState === 'idle') {
        setLevel(1);
        setGameState('showing');
        setPlayerSequence([]);
        
        sequence.forEach((color, index) => {
          setTimeout(() => {
            setActiveColor(color);
            playSimonSound(color);
            setTimeout(() => {
              setActiveColor(null);
              if (index === sequence.length - 1) {
                setGameState('playing');
              }
            }, DELAY / 2);
          }, (index + 1) * DELAY);
        });
    }
  }, [sequence, gameState]);

  const handlePlayerClick = (color: string) => {
    if (gameState !== 'playing') return;

    const newPlayerSequence = [...playerSequence, color];
    setPlayerSequence(newPlayerSequence);
    playSimonSound(color);

    if (newPlayerSequence[newPlayerSequence.length - 1] !== sequence[newPlayerSequence.length - 1]) {
      // Game Over
      playGameOverSound();
      setGameState('over');
      if (level > highScore) {
        setHighScore(level);
        onNewHighScore('Simon Says', level);
      }
      return;
    }

    if (newPlayerSequence.length === sequence.length) {
      setTimeout(() => nextLevel(), 1000);
    }
  };

  const colorClasses: { [key: string]: string } = {
    green: 'bg-green-500 hover:bg-green-400 shadow-[0_0_20px_theme(colors.green.500/80%)]',
    red: 'bg-red-500 hover:bg-red-400 shadow-[0_0_20px_theme(colors.red.500/80%)]',
    yellow: 'bg-yellow-500 hover:bg-yellow-400 shadow-[0_0_20px_theme(colors.yellow.500/80%)]',
    blue: 'bg-blue-500 hover:bg-blue-400 shadow-[0_0_20px_theme(colors.blue.500/80%)]',
  };
  
  const activeColorClasses: { [key: string]: string } = {
    green: 'bg-green-300 scale-105',
    red: 'bg-red-300 scale-105',
    yellow: 'bg-yellow-300 scale-105',
    blue: 'bg-blue-300 scale-105',
  }

  return (
    <div className="flex flex-col items-center p-4 w-full max-w-md mx-auto text-center animate-fade-in-up">
      <h2 className="text-4xl font-bold mb-2">Simon Says</h2>
      <p className="text-slate-400 mb-4">Repeat the sequence of colors.</p>
       <div className="flex gap-8 mb-4">
          <p>Level: <span key={levelKey} className="font-bold text-cyan-400 animate-score-pop">{level}</span></p>
          <p>High Score: <span className="font-bold text-yellow-400">{highScore}</span></p>
      </div>

      <div className="relative w-96 h-96">
        {gameState === 'idle' || gameState === 'over' ? (
          <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-10 rounded-full">
            <h3 className="text-3xl font-bold text-white mb-4">{gameState === 'over' ? `Game Over! Level ${level}` : 'Ready?'}</h3>
            <StyledButton onClick={startGame}>
              {gameState === 'over' ? 'Play Again' : 'Start Game'}
            </StyledButton>
          </div>
        ) : <p className="absolute inset-0 flex items-center justify-center text-2xl font-bold">{gameState === 'showing' ? 'Watch' : 'Repeat'}</p>}
        
        <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-2">
            {COLORS.map((color) => (
                <div
                    key={color}
                    onClick={() => handlePlayerClick(color)}
                    className={`w-full h-full rounded-lg transition-all duration-200 cursor-pointer 
                                ${colorClasses[color]} 
                                ${activeColor === color ? activeColorClasses[color] : ''}
                                ${color === 'green' ? 'rounded-tl-full' : ''}
                                ${color === 'red' ? 'rounded-tr-full' : ''}
                                ${color === 'yellow' ? 'rounded-bl-full' : ''}
                                ${color === 'blue' ? 'rounded-br-full' : ''}`}
                ></div>
            ))}
        </div>
      </div>

      <button onClick={onBack} className="mt-12 text-slate-400 hover:text-cyan-400 transition-colors">
        &larr; Back to Menu
      </button>
    </div>
  );
};

export default SimonSaysGame;
