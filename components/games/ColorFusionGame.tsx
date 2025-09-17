import React from 'react';

interface ColorFusionGameProps {
  onBack: () => void;
}

const ColorFusionGame: React.FC<ColorFusionGameProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col items-center p-6 sm:p-8 w-full max-w-2xl mx-auto text-center bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-700/50 animate-fade-in-up">
      <h2 className="text-4xl font-bold mb-4">Color Fusion</h2>
      <p className="text-slate-400 mb-8">
        Combine primary colors to create complex new hues.
      </p>
      <div className="w-full h-64 bg-slate-900/50 rounded-lg flex items-center justify-center border border-slate-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center z-10 text-center p-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-cyan-400 mb-4 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <h3 className="text-2xl font-bold text-slate-200">Coming Soon!</h3>
          <p className="text-slate-400 mt-1">This game is under development.</p>
        </div>
      </div>
      <button onClick={onBack} className="group mt-12 text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        <span>Back to Menu</span>
      </button>
    </div>
  );
};

export default React.memo(ColorFusionGame);