
import React from 'react';

interface GameCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onSelect: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ title, description, icon, onSelect }) => {
  return (
    <div 
      className="bg-slate-800/50 rounded-xl p-6 flex flex-col items-center text-center cursor-pointer
                 border border-slate-700 hover:border-cyan-400 transition-all duration-300 
                 transform hover:scale-105 hover:shadow-[0_0_25px_theme(colors.cyan.500/40%)]"
      onClick={onSelect}
    >
      <div className="text-cyan-400 mb-4">
        {icon}
      </div>
      <h2 className="text-2xl font-bold mb-2 text-slate-100">{title}</h2>
      <p className="text-slate-400">{description}</p>
    </div>
  );
};

export default GameCard;