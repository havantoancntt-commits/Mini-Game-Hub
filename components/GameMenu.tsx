
import React from 'react';
import { GameId } from '../types';
import GameCard from './GameCard';

// Simple SVG icons to avoid external dependencies
const BoltIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
const CpuChipIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6V4m0 16v-2M8 8a2 2 0 012-2h4a2 2 0 012 2v8a2 2 0 01-2 2H10a2 2 0 01-2-2V8z" /></svg>;
const ChartBarIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>;
const PuzzlePieceIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>;
const SparklesIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>;
const CubeIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>;
const HandIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11" /></svg>;
const TableCellsIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>;
const Game2048Icon = <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 12h4m-4 4h4m-4-8h4" /></svg>;
const PaperAirplaneIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>;

// Fix: Explicitly type the games array to ensure `game.id` is of type `GameId`.
const games: { id: GameId; title: string; description: string; icon: React.ReactNode }[] = [
    { id: 'reaction-time', title: 'Reaction Time', description: 'Test your reflexes. Click when the box turns green!', icon: BoltIcon },
    { id: 'memory-match', title: 'Memory Match', description: 'Flip cards and find all the matching pairs.', icon: CpuChipIcon },
    { id: 'typing-speed', title: 'Typing Speed', description: 'How fast can you type? Test your WPM.', icon: ChartBarIcon },
    { id: 'word-scramble', title: 'Word Scramble', description: 'Unscramble letters to find the hidden word.', icon: PuzzlePieceIcon },
    { id: 'simon-says', title: 'Simon Says', description: 'Follow the sequence of colors and sounds.', icon: SparklesIcon },
    { id: 'snake', title: 'Classic Snake', description: 'Eat food, grow your snake, and avoid the walls.', icon: CubeIcon },
    { id: 'whack-a-mole', title: 'Whack-A-Mole', description: 'Moles are popping up! Whack them quickly.', icon: HandIcon },
    { id: 'brick-breaker', title: 'Brick Breaker', description: 'Break all the bricks with the ball and paddle.', icon: TableCellsIcon },
    { id: 'game-2048', title: '2048', description: 'Slide tiles to combine them and reach 2048.', icon: Game2048Icon },
    { id: 'flappy-bird', title: 'Flappy Bird', description: 'Flap through the pipes and get the high score.', icon: PaperAirplaneIcon },
  ];

interface GameMenuProps {
  onSelectGame: (gameId: GameId) => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ onSelectGame }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
      {games.map((game) => (
        <GameCard
          key={game.id}
          title={game.title}
          description={game.description}
          icon={game.icon}
          onSelect={() => onSelectGame(game.id)}
        />
      ))}
    </div>
  );
};

export default GameMenu;