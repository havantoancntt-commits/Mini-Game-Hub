import React, { useState } from 'react';
import Header from './components/Header';
import GameMenu from './components/GameMenu';
import ReactionTimeGame from './components/games/ReactionTimeGame';
import MemoryMatchGame from './components/games/MemoryMatchGame';
import TypingSpeedGame from './components/games/TypingSpeedGame';
import WordScrambleGame from './components/games/WordScrambleGame';
import SnakeGame from './components/games/SnakeGame';
import SimonSaysGame from './components/games/SimonSaysGame';
import WhackAMoleGame from './components/games/WhackAMoleGame';
import BrickBreakerGame from './components/games/BrickBreakerGame';
import Game2048 from './components/games/Game2048';
import FlappyBirdGame from './components/games/FlappyBirdGame';
import { GameId } from './types';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<GameId | null>(null);

  const handleSelectGame = (gameId: GameId) => {
    setSelectedGame(gameId);
  };

  const handleBackToMenu = () => {
    setSelectedGame(null);
  };

  const renderGame = () => {
    switch (selectedGame) {
      case 'reaction-time':
        return <ReactionTimeGame onBack={handleBackToMenu} />;
      case 'memory-match':
        return <MemoryMatchGame onBack={handleBackToMenu} />;
      case 'typing-speed':
        return <TypingSpeedGame onBack={handleBackToMenu} />;
      case 'word-scramble':
        return <WordScrambleGame onBack={handleBackToMenu} />;
      case 'snake':
        return <SnakeGame onBack={handleBackToMenu} />;
      case 'simon-says':
        return <SimonSaysGame onBack={handleBackToMenu} />;
      case 'whack-a-mole':
        return <WhackAMoleGame onBack={handleBackToMenu} />;
      case 'brick-breaker':
        return <BrickBreakerGame onBack={handleBackToMenu} />;
      case 'game-2048':
        return <Game2048 onBack={handleBackToMenu} />;
      case 'flappy-bird':
        return <FlappyBirdGame onBack={handleBackToMenu} />;
      default:
        return <GameMenu onSelectGame={handleSelectGame} />;
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen flex flex-col items-center p-4 font-sans">
      <div className="w-full max-w-5xl mx-auto flex flex-col flex-grow">
        <Header title="Mini-Game Hub" />
        <main className="mt-12 flex-grow flex items-center justify-center">
          {renderGame()}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default App;
