import React from 'react';
import StyledButton from './StyledButton';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  isLoading: boolean;
}

const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose, message, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-slate-800 rounded-2xl shadow-2xl shadow-cyan-500/10 p-6 sm:p-8 w-full max-w-lg border border-slate-700 relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
          Thank You!
        </h2>
        
        <div className="mt-6 p-4 bg-slate-700/50 rounded-lg border border-slate-600 min-h-[120px] flex items-center justify-center">
          {isLoading ? (
             <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          ) : (
            <p className="text-slate-300 whitespace-pre-wrap">{message}</p>
          )}
        </div>

        <div className="mt-8">
            <StyledButton onClick={() => window.open('https://github.com/sponsors/google', '_blank')}>
                Donate Here
            </StyledButton>
        </div>
      </div>
    </div>
  );
};

export default SupportModal;
