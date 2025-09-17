
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

// Icons for new games
const MusicNoteIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-16c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 9l12-3" /></svg>;
const SwitchVerticalIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 12l-4-4m4 4l4-4m6 8V8m0 12l-4-4m4 4l4-4" /></svg>;
const BeakerIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a4 4 0 00-5.656 0l-2.829 2.828a4 4 0 01-5.656-5.656l2.828-2.829a4 4 0 000-5.656l-1.414-1.414a2 2 0 00-2.828 0L1.586 10.586a4 4 0 005.656 5.656l2.829-2.828a4 4 0 015.656 0l1.414 1.414a2 2 0 002.828 0l2.829-2.829z" /></svg>;
const ViewfinderCircleIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10h.01M15 10h.01M12 6v.01M12 18v.01M10 15h4" /></svg>;
const RocketLaunchIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899l4-4a4 4 0 005.656 5.656l-4 4" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 12l6-6" /></svg>;
const KeyIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2v5a2 2 0 01-2 2H9a2 2 0 01-2-2V9a2 2 0 012-2h6zM15 7V5a2 2 0 00-2-2H9a2 2 0 00-2 2v2M12 11h.01" /></svg>;
const PencilSwooshIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l-5-5" /></svg>;
const ClockIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const LayersIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l9-4 9 4-9 4-9-4zM21 14l-9 4-9-4" /></svg>;
const ArrowsRightLeftIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18m-4 8l4-4m0 0l-4-4m4 4H3" /></svg>;


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
    { id: 'rhythm-orb', title: 'Rhythm Orb', description: 'Tap in sync with the music as the orb hits the mark.', icon: MusicNoteIcon },
    { id: 'gravity-shift', title: 'Gravity Shift', description: 'Flip gravity to run on the ceiling and avoid obstacles.', icon: SwitchVerticalIcon },
    { id: 'color-fusion', title: 'Color Fusion', description: 'Combine primary colors to create complex new hues.', icon: BeakerIcon },
    { id: 'echo-maze', title: 'Echo Maze', description: 'Navigate an invisible maze using sonar pings to see.', icon: ViewfinderCircleIcon },
    { id: 'astro-drift', title: 'Astro Drift', description: 'Use careful thrusts to pilot a ship through asteroids.', icon: RocketLaunchIcon },
    { id: 'code-breaker-ai', title: 'Code Breaker AI', description: 'Outsmart the Gemini AI by cracking its secret code.', icon: KeyIcon },
    { id: 'glyph-painter', title: 'Glyph Painter', description: 'Draw complex symbols with a single continuous line.', icon: PencilSwooshIcon },
    { id: 'time-warp-pinball', title: 'Time Warp Pinball', description: 'Classic pinball, but you can slow down time.', icon: ClockIcon },
    { id: 'stack-n-balance', title: 'Stack n Balance', description: 'Stack odd-shaped blocks on a wobbly platform.', icon: LayersIcon },
    { id: 'path-finder', title: 'Path Finder', description: 'Connect matching dots without crossing any paths.', icon: ArrowsRightLeftIcon },
  ];

interface GameMenuProps {
  onSelectGame: (gameId: GameId) => void;
}

const GameMenu: React.FC<GameMenuProps> = ({ onSelectGame }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {games.map((game, index) => (
        <div
          key={game.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'backwards' }}
        >
          <GameCard
            title={game.title}
            description={game.description}
            icon={game.icon}
            onSelect={() => onSelectGame(game.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default GameMenu;