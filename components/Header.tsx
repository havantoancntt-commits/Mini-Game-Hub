import React from 'react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="text-center animate-fade-in-up">
      <div className="flex justify-center items-center gap-4">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 sm:h-12 sm:w-12 text-cyan-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H5.25a2.25 2.25 0 00-2.25 2.25v5.25" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 22.5h5.25a2.25 2.25 0 002.25-2.25v-5.25" />
        </svg>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-fuchsia-500 to-orange-400 animate-shimmer text-glow">
          {title}
        </h1>
      </div>
      <p className="mt-3 text-md sm:text-lg text-slate-400 max-w-2xl tracking-wide">
        Your Ultimate Destination for Fun & Engaging Browser Games
      </p>
    </header>
  );
};

export default React.memo(Header);