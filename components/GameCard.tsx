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
      className="group bg-slate-800/60 backdrop-blur-md rounded-xl p-4 sm:p-6 flex flex-col items-center text-center cursor-pointer
                 border border-slate-700/80 hover:border-cyan-400/60 transition-all duration-300 h-full
                 transform hover:scale-105 hover:shadow-[0_0_40px_hsla(188,83%,47%,0.3)]"
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => { if (e.key === 'Enter') onSelect(); }}
    >
      <div className="text-cyan-400 mb-4 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      <h2 className="text-xl sm:text-2xl font-bold mb-2 text-slate-100">{title}</h2>
      <p className="text-slate-400 text-sm">{description}</p>
    </div>
  );
};

export default GameCard;
