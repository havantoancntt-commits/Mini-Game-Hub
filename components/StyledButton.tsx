import React from 'react';
import { playClickSound } from '../utils/audio';

interface StyledButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const StyledButton: React.FC<StyledButtonProps> = ({ children, onClick, ...props }) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    playClickSound();
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <button
      {...props}
      onClick={handleClick}
      className="px-6 py-3 font-bold text-white bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-lg 
                 shadow-lg shadow-cyan-500/20 hover:shadow-[0_0_20px_hsla(188,95%,49%,0.7)]
                 hover:from-cyan-400 hover:to-fuchsia-400 transform hover:scale-105 hover:brightness-110 transition-all 
                 duration-300 focus:outline-none focus:ring-4 focus:ring-offset-2 
                 focus:ring-offset-slate-900 focus:ring-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
    >
      {children}
    </button>
  );
};

export default StyledButton;