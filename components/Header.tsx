import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-fuchsia-500 to-orange-400 animate-shimmer text-3d-glow">
        {title}
      </h1>
      <p className="mt-2 text-md sm:text-lg text-slate-400 max-w-2xl tracking-wide">
        Your Ultimate Destination for Fun & Engaging Browser Games
      </p>
    </header>
  );
};

export default Header;
