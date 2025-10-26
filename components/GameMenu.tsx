import React from 'react';
import { GameId } from '../types';
import GameCard from './GameCard';

const JumpIcon = (
    <div className="relative h-16 w-16 text-cyan-400">
        <div className="absolute top-4 left-4 w-5 h-5 bg-current rounded-sm animate-bounce" style={{animationDuration: '1.2s', animationIterationCount: 'infinite'}}></div>
        <div className="absolute bottom-2 left-0 w-full h-0.5 bg-slate-500"></div>
        <div 
            className="absolute bottom-2.5 left-[65%] w-0 h-0 
                       border-l-[12px] border-l-transparent 
                       border-r-[12px] border-r-transparent 
                       border-b-[12px] border-b-red-500"
        ></div>
         <div 
            className="absolute bottom-2.5 left-[35%] w-0 h-0 
                       border-l-8 border-l-transparent 
                       border-r-8 border-r-transparent 
                       border-b-8 border-b-red-500"
        ></div>
    </div>
);

const game: { id: GameId; title: string; description: string; icon: React.ReactNode } = {
  id: 'impossible-jump',
  title: "The Impossible Jump",
  description: "A brutally difficult, minimalist reflex game. Can you clear even one spike?",
  icon: JumpIcon,
};

interface GameMenuProps {
  onSelectGame: (gameId: GameId) => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ onSelectGame }) => {
  return (
    <div className="w-full flex flex-col justify-center items-center animate-fade-in p-4 sm:p-6">
      <h2 className="text-3xl font-bold text-slate-300 mb-2 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>Game Selection</h2>
      <p className="text-slate-500 mb-8 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>Choose a game to begin</p>
      <div
        className="animate-fade-in-up w-full max-w-xs sm:max-w-sm"
        style={{ animationDelay: '0.4s' }}
      >
        <GameCard
          title={game.title}
          description={game.description}
          icon={game.icon}
          onSelect={() => onSelectGame(game.id)}
        />
      </div>
    </div>
  );
};

export default GameMenu;