import React, { useState, useMemo, useCallback, lazy, Suspense } from 'react';
import { GameId } from './types';

// Components
import Header from './components/Header';
import GameMenu from './components/GameMenu';
import Footer from './components/Footer';
import SupportModal from './components/SupportModal';
import ErrorBoundary from './components/ErrorBoundary';

// Spinner component for Suspense fallback
const GameLoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center text-center p-8">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400" role="status" aria-label="Loading"></div>
    <p className="mt-4 text-lg text-slate-300">Loading Game...</p>
  </div>
);

// Lazy-loaded Game Components
const ReactionTimeGame = lazy(() => import('./components/games/ReactionTimeGame'));
const MemoryMatchGame = lazy(() => import('./components/games/MemoryMatchGame'));
const TypingSpeedGame = lazy(() => import('./components/games/TypingSpeedGame'));
const WordScrambleGame = lazy(() => import('./components/games/WordScrambleGame'));
const SnakeGame = lazy(() => import('./components/games/SnakeGame'));
const SimonSaysGame = lazy(() => import('./components/games/SimonSaysGame'));
const WhackAMoleGame = lazy(() => import('./components/games/WhackAMoleGame'));
const BrickBreakerGame = lazy(() => import('./components/games/BrickBreakerGame'));
const Game2048 = lazy(() => import('./components/games/Game2048'));
const FlappyBirdGame = lazy(() => import('./components/games/FlappyBirdGame'));
const RhythmOrbGame = lazy(() => import('./components/games/RhythmOrbGame'));
const GravityShiftGame = lazy(() => import('./components/games/GravityShiftGame'));
const ColorFusionGame = lazy(() => import('./components/games/ColorFusionGame'));
const EchoMazeGame = lazy(() => import('./components/games/EchoMazeGame'));
const AstroDriftGame = lazy(() => import('./components/games/AstroDriftGame'));
const CodeBreakerAIGame = lazy(() => import('./components/games/CodeBreakerAIGame'));
const GlyphPainterGame = lazy(() => import('./components/games/GlyphPainterGame'));
const TimeWarpPinballGame = lazy(() => import('./components/games/TimeWarpPinballGame'));
const StackNBalanceGame = lazy(() => import('./components/games/StackNBalanceGame'));
const PathFinderGame = lazy(() => import('./components/games/PathFinderGame'));


const App: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<GameId | null>(null);
  const [isDonateModalOpen, setIsDonateModalOpen] = useState(false);
  const [donateMessage, setDonateMessage] = useState('');
  const [isGeneratingMessage, setIsGeneratingMessage] = useState(false);

  const handleSelectGame = (gameId: GameId) => {
    setSelectedGame(gameId);
  };

  const handleBackToMenu = useCallback(() => {
    setSelectedGame(null);
  }, []);

  const handleNewHighScore = useCallback(async (gameName: string, score: number | string) => {
    setIsGeneratingMessage(true);
    setDonateMessage(''); // Clear previous message
    setIsDonateModalOpen(true);

    try {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      
      const prompt = `A player just set a new high score of ${score} in the game "${gameName}". Write a short, exciting, and congratulatory message (2-3 sentences). Then, humbly ask if they would consider a small donation to support the ad-free development of the game hub.`;
      
      const result = await ai.models.generateContent({
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
  }), [handleNewHighScore, handleBackToMenu]);

  const CurrentGame = useMemo(() => {
    if (!selectedGame) return null;
    return gameComponents[selectedGame];
  }, [selectedGame, gameComponents]);

  return (
    <div className="bg-slate-900 text-white min-h-screen flex flex-col font-sans aurora-background">
      <div className="flex-grow flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        <Header title="Mini-Game Hub" />
        <main className="w-full max-w-7xl mx-auto mt-8 flex-grow flex items-center justify-center">
          {CurrentGame ? (
            <div className="w-full animate-fade-in">
              <ErrorBoundary>
                <Suspense fallback={<GameLoadingSpinner />}>
                  {CurrentGame}
                </Suspense>
              </ErrorBoundary>
            </div>
          ) : (
            <GameMenu onSelectGame={handleSelectGame} />
          )}
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