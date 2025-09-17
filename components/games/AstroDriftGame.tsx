import React from 'react';
import StyledButton from '../StyledButton';

interface AstroDriftGameProps {
  onBack: () => void;
}

const AstroDriftGame: React.FC<AstroDriftGameProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-2xl mx-auto text-center animate-fade-in-up">
      <h2 className="text-4xl font-bold mb-4">Astro Drift</h2>
      <p className="text-slate-400 mb-8">
        Coming Soon! Master Newtonian physics to carefully navigate your ship to the landing pad.
      </p>
      <div className="w-full h-64 bg-slate-800 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-600">
        <p className="text-slate-500">Game Area</p>
      </div>
      <div className="mt-12">
        <button onClick={onBack} className="text-slate-400 hover:text-cyan-400 transition-colors">
          &larr; Back to Menu
        </button>
      </div>
    </div>
  );
};

export default AstroDriftGame;