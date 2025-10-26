import React, { useRef, useState, MouseEvent } from 'react';

interface GameCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onSelect: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ title, description, icon, onSelect }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState({});

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const rotateX = (y / height - 0.5) * -20;
    const rotateY = (x / width - 0.5) * 20;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`,
      '--glow-x': `${x}px`,
      '--glow-y': `${y}px`,
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)',
    });
  };

  return (
    <div
      ref={cardRef}
      className="group relative bg-slate-800/60 rounded-xl flex flex-col items-center text-center cursor-pointer
                 border border-slate-700/80 transition-transform duration-300 ease-out h-full
                 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 focus-visible:ring-cyan-400"
      style={style}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => { if (e.key === 'Enter') onSelect(); }}
    >
      <div className="relative w-full h-full p-6 sm:p-8 rounded-xl overflow-hidden">
        {/* Dynamic Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
             style={{
               background: `radial-gradient(circle 300px at var(--glow-x, 150px) var(--glow-y, 150px), hsla(188, 95%, 41%, 0.15), transparent)`,
             }}/>
             
        {/* Glossy Overlay */}
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-t-xl opacity-80 group-hover:from-white/20 transition-opacity duration-300"></div>

        <div className="mb-4 transition-transform duration-300 group-hover:scale-110">
          {icon}
        </div>
        <h2 className="text-xl sm:text-2xl font-bold mb-2 text-slate-100">{title}</h2>
        <p className="text-slate-400 text-sm mb-4">{description}</p>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full">
            <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4 py-2 rounded-full bg-cyan-500/20 text-cyan-300 text-sm font-semibold">
                Play Now
            </span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(GameCard);