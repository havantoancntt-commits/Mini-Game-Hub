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
  <div className="flex flex-col items-center justify-center text-center p-8 h-full">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400" role="status" aria-label="Loading"></div>
    <p className="mt-4 text-lg text-slate-300">Loading Game...</p>
  </div>
);

// Lazy-loaded Game Component - NOTE: File name is reused due to constraints, but contains the new game.
const ImpossibleJumpGame = lazy(() => import('./components/games/CouplesChallengeGame'));


const App: React.FC = () => {
  const [selectedGame, setSelectedGame] = useState<GameId | null>(null);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const handleSelectGame = (gameId: GameId) => {
    setSelectedGame(gameId);
  };

  const handleBackToMenu = useCallback(() => {
    setSelectedGame(null);
  }, []);

  const openSupportModal = () => {
      setIsSupportModalOpen(true);
  };
  
  const closeSupportModal = () => {
      setIsSupportModalOpen(false);
  };

  const gameComponents: Record<GameId, React.ReactNode> = useMemo(() => ({
    'impossible-jump': <ImpossibleJumpGame onBack={handleBackToMenu} />,
  }), [handleBackToMenu]);

  const CurrentGame = useMemo(() => {
    if (!selectedGame) return null;
    return gameComponents[selectedGame];
  }, [selectedGame, gameComponents]);

  return (
    <div className="text-white min-h-screen flex flex-col font-sans">
      <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 md:p-8">
        <Header title="Mini-Game Hub" />
        
        <main 
          className="w-full max-w-4xl mx-auto mt-8 mb-8 flex-grow flex items-center justify-center 
                     bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-cyan-400/20 
                     shadow-[0_0_80px_hsla(215,69%,40%,0.2)] transition-all duration-500"
          style={{ minHeight: '70vh' }}
        >
          {CurrentGame ? (
            <div className="w-full h-full animate-fade-in">
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
        
        <Footer onSupportClick={openSupportModal} />
      </div>

      <SupportModal 
        isOpen={isSupportModalOpen} 
        onClose={closeSupportModal}
        message="This project is a labor of love, designed to be a fun, ad-free space for everyone. If you're enjoying the games, please consider a small donation to support development and server costs. Thank you!"
        isLoading={false}
      />
    </div>
  );
};

export default App;