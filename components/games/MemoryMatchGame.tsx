import React, { useState, useEffect, useCallback } from 'react';
import StyledButton from '../StyledButton';
import useLocalStorage from '../../hooks/useLocalStorage';
import { playMatchSound, playErrorSound, playWinSound, playClickSound } from '../../utils/audio';

interface MemoryMatchGameProps {
  onBack: () => void;
}

interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

const generateCards = (): Card[] => {
  const cardValues = [...EMOJIS, ...EMOJIS];
  const shuffled = cardValues.sort(() => Math.random() - 0.5);
  return shuffled.map((value, index) => ({
    id: index,
    value,
    isFlipped: false,
    isMatched: false,
  }));
};

const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({ onBack }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isGameWon, setIsGameWon] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [highScore, setHighScore] = useLocalStorage('memory-match-hs', Infinity);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  const resetGame = useCallback(() => {
    setCards(generateCards());
    setFlippedIndices([]);
    setMoves(0);
    setIsGameWon(false);
    setIsChecking(false);
    setIsNewHighScore(false);
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      setIsChecking(true);
      const [firstIndex, secondIndex] = flippedIndices;
      if (cards[firstIndex].value === cards[secondIndex].value) {
        playMatchSound();
        setTimeout(() => {
          setCards(prev =>
            prev.map(card =>
              card.id === firstIndex || card.id === secondIndex
                ? { ...card, isMatched: true }
                : card
            )
          );
          setFlippedIndices([]);
          setIsChecking(false);
        }, 300);
      } else {
        playErrorSound();
        setTimeout(() => {
          setCards(prev =>
            prev.map(card =>
              card.id === firstIndex || card.id === secondIndex
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedIndices([]);
          setIsChecking(false);
        }, 1000);
      }
      setMoves(prev => prev + 1);
    }
  }, [flippedIndices, cards]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      playWinSound();
      if (moves < highScore) {
        setHighScore(moves);
        setIsNewHighScore(true);
      }
      setTimeout(() => setIsGameWon(true), 500);
    }
  }, [cards, moves, highScore, setHighScore]);

  const handleCardClick = (index: number) => {
    if (isChecking || cards[index].isFlipped || cards[index].isMatched) {
      return;
    }
    playClickSound();
    setCards(prev =>
      prev.map(card =>
        card.id === index ? { ...card, isFlipped: true } : card
      )
    );
    setFlippedIndices(prev => [...prev, index]);
  };
  
  if (isGameWon) {
    return (
        <div className="text-center flex flex-col items-center animate-fade-in-up">
            {isNewHighScore ? (
                <h2 className="text-4xl font-bold mb-4 text-yellow-400 animate-bounce">New Best Score!</h2>
            ) : (
                <h2 className="text-4xl font-bold mb-4 text-cyan-400">You Win!</h2>
            )}
            <p className="text-slate-300 text-xl mb-2">You found all pairs in <span className="text-white font-bold">{moves}</span> moves.</p>
            <p className="text-yellow-400 text-lg mb-8">Your best is {highScore} moves.</p>
            <StyledButton onClick={resetGame}>Play Again</StyledButton>
             <div className="mt-12">
                <button onClick={onBack} className="text-slate-400 hover:text-cyan-400 transition-colors">
                  &larr; Back to Menu
                </button>
            </div>
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="mb-6 flex justify-between w-full max-w-md text-xl font-bold text-slate-300">
        <div>Moves: <span className="text-white animate-score-pop" key={moves}>{moves}</span></div>
        <div>Best: <span className="text-yellow-400">{highScore === Infinity ? 'N/A' : highScore}</span></div>
      </div>
      <div className="grid grid-cols-4 gap-4 max-w-md mx-auto">
        {cards.map((card) => (
          <div key={card.id} className="w-20 h-20 sm:w-24 sm:h-24 perspective-1000" onClick={() => handleCardClick(card.id)}>
            <div className={`relative w-full h-full transition-transform duration-500 transform-style-3d ${card.isFlipped ? 'rotate-y-180' : ''} ${card.isMatched ? 'opacity-50 scale-95' : ''}`}>
              <div className="absolute w-full h-full bg-slate-700 hover:bg-slate-600 transition-colors rounded-lg flex items-center justify-center text-3xl font-bold backface-hidden cursor-pointer">
                ?
              </div>
              <div className={`absolute w-full h-full rounded-lg flex items-center justify-center text-4xl rotate-y-180 backface-hidden ${card.isMatched ? 'bg-emerald-500 animate-pulse-glow-cyan' : 'bg-cyan-500'}`}>
                {card.value}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-12">
         <button onClick={onBack} className="text-slate-400 hover:text-cyan-400 transition-colors">
           &larr; Back to Menu
         </button>
      </div>
      <style>{`
        .transform-style-3d { transform-style: preserve-3d; }
        .perspective-1000 { perspective: 1000px; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .backface-hidden { backface-visibility: hidden; }
      `}</style>
    </div>
  );
};

export default MemoryMatchGame;