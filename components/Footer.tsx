import React from 'react';

interface FooterProps {
    onSupportClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onSupportClick }) => {
  return (
    <footer className="w-full text-center p-4 sm:p-6 text-slate-500 border-t border-slate-800/80 bg-slate-900/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto flex flex-col justify-center items-center gap-4">
        <p className="max-w-2xl">
          Enjoying the games? This hub is a passion project, kept alive and ad-free by awesome people like you.
        </p>
        <button 
          onClick={onSupportClick} 
          className="px-6 py-2 font-bold text-white bg-gradient-to-r from-cyan-500 to-fuchsia-500 rounded-lg 
                     shadow-lg shadow-cyan-500/20 transform transition-all duration-300
                     focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-slate-900 
                     focus:ring-cyan-300 animate-pulse-glow-subtle hover:brightness-110"
        >
          Support the Developer
        </button>
         <p className="text-sm mt-4">&copy; {new Date().getFullYear()} Mini-Game Hub. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;