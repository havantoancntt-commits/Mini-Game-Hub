import React, { useState, useEffect, useMemo } from 'react';
import { playMatchSound, playWinSound, playClickSound } from '../../utils/audio';
import StyledButton from '../StyledButton';
import useLocalStorage from '../../hooks/useLocalStorage';

interface MemoryMatchGameProps {
  onBack: () => void;
  onNewHighScore: (gameName: string, score: string) => void;
}

const EMOJIS = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

type Card = {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const createBoard = (): Card[] => {
  const cardValues = [...EMOJIS, ...EMOJIS];
  cardValues.sort(() => Math.random() - 0.5);
  return cardValues.map((emoji, index) => ({
    id: index,
    emoji,
    isFlipped: false,
    isMatched: false,
  }));
};

const MemoryMatchGame: React.FC<MemoryMatchGameProps> = ({ onBack, onNewHighScore }) => {
  const [cards, setCards] = useState<Card[]>(createBoard());
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [bestScore, setBestScore] = useLocalStorage<number | null>('memory-match-highscore', null);
  const movesKey = useMemo(() => Date.now(), [moves]);

  useEffect(() => {
    if (flippedIndices.length === 2) {
      const [firstIndex, secondIndex] = flippedIndices;
      if (cards[firstIndex].emoji === cards[secondIndex].emoji) {
        setCards(prevCards =>
          prevCards.map(card =>
            card.emoji === cards[firstIndex].emoji ? { ...card, isMatched: true } : card
          )
        );
        playMatchSound();
        setFlippedIndices([]);
      } else {
        setTimeout(() => {
          setCards(prevCards =>
            prevCards.map((card, index) =>
              index === firstIndex || index === secondIndex ? { ...card, isFlipped: false } : card
            )
          );
          setFlippedIndices([]);
        }, 1000);
      }
    }
  }, [flippedIndices, cards]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.isMatched)) {
      setIsGameOver(true);
      playWinSound();
      if (bestScore === null || moves < bestScore) {
        setBestScore(moves);
        onNewHighScore('Memory Match', `${moves} moves`);
      }
    }
  }, [cards, moves, bestScore, setBestScore, onNewHighScore]);

  const handleCardClick = (index: number) => {
    if (isGameOver || flippedIndices.length >= 2 || cards[index].isFlipped) {
      return;
    }
    
    playClickSound();

    setCards(prevCards =>
      prevCards.map((card, i) => (i === index ? { ...card, isFlipped: true } : card))
    );
    setFlippedIndices(prev => [...prev, index]);
    if (flippedIndices.length === 0) {
      setMoves(m => m + 1);
    }
  };
  
  const restartGame = () => {
      setCards(createBoard());
      setFlippedIndices([]);
      setMoves(0);
      setIsGameOver(false);
  }

  return (
    <div className="flex flex-col items-center p-6 sm:p-8 w-full max-w-md mx-auto text-center bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-700/50 animate-fade-in-up">
      <h2 className="text-4xl font-bold mb-2">Memory Match</h2>
      <p className="text-slate-400 mb-6">Flip cards to find all matching pairs.</p>
      <div className="flex gap-8 mb-4">
        <p className="text-lg">Moves: <span key={movesKey} className="font-bold text-cyan-400 animate-score-pop">{moves}</span></p>
        {bestScore && <p className="text-lg">Best: <span className="font-bold text-yellow-400">{bestScore}</span></p>}
      </div>

      {isGameOver ? (
         <div className="flex flex-col items-center justify-center min-h-[300px]">
            <h3 className="text-3xl font-bold text-green-400 mb-4">You Won!</h3>
            <p className="mb-4">You found all pairs in {moves} moves.</p>
            <StyledButton onClick={restartGame}>Play Again</StyledButton>
         </div>
      ) : (
        <div className="grid grid-cols-4 gap-2 sm:gap-4 w-full">
            {cards.map((card, index) => (
            <div
                key={card.id}
                className="aspect-square rounded-lg cursor-pointer transform-gpu"
                style={{ perspective: '1000px' }}
                onClick={() => handleCardClick(index)}
            >
                <div
                className={`relative w-full h-full transition-transform duration-500 ${card.isMatched ? 'animate-pulse-glow-cyan' : ''}`}
                style={{ transformStyle: 'preserve-3d', transform: card.isFlipped || card.isMatched ? 'rotateY(180deg)' : '' }}
                >
                <div className="absolute w-full h-full bg-slate-700 rounded-lg flex items-center justify-center" style={{ backfaceVisibility: 'hidden' }}>
                    <span className="text-2xl sm:text-3xl">?</span>
                </div>
                <div className="absolute w-full h-full bg-slate-500 rounded-lg flex items-center justify-center" style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}>
                    <span className="text-3xl sm:text-4xl">{card.emoji}</span>
                </div>
                </div>
            </div>
            ))}
        </div>
      )}

      <button onClick={onBack} className="group mt-12 text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        <span>Back to Menu</span>
      </button>
    </div>
  );
};

export default MemoryMatchGame;