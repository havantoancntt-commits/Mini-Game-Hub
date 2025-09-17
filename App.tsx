import React, { useState, useMemo, useCallback } from 'react';
import { GameId } from './types';
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';

// Components
import Header from './components/Header';
import GameMenu from './components/GameMenu';
import Footer from './components/Footer';
import SupportModal from './components/SupportModal';

// Game Components
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
import RhythmOrbGame from './components/games/RhythmOrbGame';
import GravityShiftGame from './components/games/GravityShiftGame';
import ColorFusionGame from './components/games/ColorFusionGame';
import EchoMazeGame from './components/games/EchoMazeGame';
import AstroDriftGame from './components/games/AstroDriftGame';
import CodeBreakerAIGame from './components/games/CodeBreakerAIGame';
import GlyphPainterGame from './components/games/GlyphPainterGame';
import TimeWarpPinballGame from './components/games/TimeWarpPinballGame';
import StackNBalanceGame from './components/games/StackNBalanceGame';
import PathFinderGame from './components/games/PathFinderGame';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const App: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<GameId | null>(null);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [donateMessage, setDonateMessage] = useState('');
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);

  const handleSelectGame = (gameId: GameId) => {
    setSelectedGame(gameId);
  };

  const handleBackToMenu = () => {
    setSelectedGame(null);
  };

  const handleNewHighScore = useCallback(async (gameName: string, score: number | string) => {
    setIsGeneratingMessage(true);
    setDonateMessage(''); // Clear previous message
    setIsDonateModalOpen(true);

    try {
      const prompt = `A player just set a new high score of ${score} in the game "${gameName}". Write a short, exciting, and congratulatory message (2-3 sentences). Then, humbly ask if they would consider a small donation to support the ad-free development of the game hub.`;
      
      const result: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      setDonateMessage(result.text);
    } catch (error) {
      console.error("Gemini API error:", error);
      setDonateMessage("Wow, you set a new high score! That's amazing! Your support helps us keep these games running and ad-free. Thank you for playing!");
    } finally {
      setIsGeneratingMessage(false);
    }
  }, []);
  
  const openSupportModalWithGenericMessage = () => {
      setDonateMessage("This project is a labor of love, designed to be a fun, ad-free space for everyone. If you're enjoying the games, please consider a small donation to support development and server costs. Thank you!");
      setIsGeneratingMessage(false);
      setIsDonateModalOpen(true);
  };

  const gameComponents: Record<GameId, React.ReactNode> = useMemo(() => ({
    'reaction-time': <ReactionTimeGame onBack={handleBackToMenu} onNewHighScore={handleNewHighScore} />,
    'memory-match': <MemoryMatchGame onBack={handleBackToMenu} onNewHighScore={handleNewHighScore} />,
    'typing-speed': <TypingSpeedGame onBack={handleBackToMenu} onNewHighScore={handleNewHighScore} />,
    'word-scramble': <WordScrambleGame onBack={handleBackToMenu} onNewHighScore={handleNewHighScore} />,
    'snake': <SnakeGame onBack={handleBackToMenu} onNewHighScore={handleNewHighScore} />,
    'simon-says': <SimonSaysGame onBack={handleBackToMenu} onNewHighScore={handleNewHighScore} />,
    'whack-a-mole': <WhackAMoleGame onBack={handleBackToMenu} onNewHighScore={handleNewHighScore} />,
    'brick-breaker': <BrickBreakerGame onBack={handleBackToMenu} onNewHighScore={handleNewHighScore} />,
    'game-2048': <Game2048 onBack={handleBackToMenu} onNewHighScore={handleNewHighScore} />,
    'flappy-bird': <FlappyBirdGame onBack={handleBackToMenu} onNewHighScore={handleNewHighScore} />,
    'rhythm-orb': <RhythmOrbGame onBack={handleBackToMenu} />,
    'gravity-shift': <GravityShiftGame onBack={handleBackToMenu} />,
    'color-fusion': <ColorFusionGame onBack={handleBackToMenu} />,
    'echo-maze': <EchoMazeGame onBack={handleBackToMenu} />,
    'astro-drift': <AstroDriftGame onBack={handleBackToMenu} />,
    'code-breaker-ai': <CodeBreakerAIGame onBack={handleBackToMenu} />,
    'glyph-painter': <GlyphPainterGame onBack={handleBackToMenu} />,
    'time-warp-pinball': <TimeWarpPinballGame onBack={handleBackToMenu} />,
    'stack-n-balance': <StackNBalanceGame onBack={handleBackToMenu} />,
    'path-finder': <PathFinderGame onBack={handleBackToMenu} />,
  }), [handleNewHighScore]);

  const CurrentGame = useMemo(() => {
    if (!selectedGame) return null;
    const Component = gameComponents[selectedGame];
    return (
        <div key={selectedGame} className="animate-fade-in w-full flex justify-center">
            {Component}
        </div>
    );
  }, [selectedGame, gameComponents]);

  return (
    <div className="bg-slate-900 text-white min-h-screen flex flex-col font-sans">
      <div className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        <Header title="Mini-Game Hub" />
        <main className="w-full max-w-7xl mx-auto mt-8 flex-grow flex items-center justify-center">
          {CurrentGame ? CurrentGame : <GameMenu onSelectGame={handleSelectGame} />}
        </main>
      </div>
      <Footer onSupportClick={openSupportModalWithGenericMessage} />
      <SupportModal 
        isOpen={isDonateModalOpen} 
        onClose={() => setIsDonateModalOpen(false)}
        message={donateMessage}
        isLoading={isGeneratingMessage}
      />
    </div>
  );
};

export default App;
