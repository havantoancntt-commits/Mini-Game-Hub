import React from 'react';
import StyledButton from '../StyledButton';

interface CodeBreakerAIGameProps {
  onBack: () => void;
}

const CodeBreakerAIGame: React.FC<CodeBreakerAIGameProps> = ({ onBack }) => {
  return (
    <div className="flex flex-col items-center p-6 sm:p-8 w-full max-w-2xl mx-auto text-center bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-700/50 animate-fade-in-up">
      <h2 className="text-4xl font-bold mb-4">Code Breaker AI</h2>
      <p className="text-slate-400 mb-8">
        Coming Soon! Challenge the Gemini AI and crack the secret code it generates.
      </p>
      <div className="w-full h-64 bg-slate-900/50 rounded-lg flex items-center justify-center border-2 border-dashed border-slate-600">
        <p className="text-slate-500">Game Area</p>
      </div>
      <button onClick={onBack} className="group mt-12 text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        <span>Back to Menu</span>
      </button>
    </div>
  );
};

export default CodeBreakerAIGame;