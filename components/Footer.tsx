import React from 'react';

interface FooterProps {
    onSupportClick: () => void;
}

const Footer: React.FC<FooterProps> = ({ onSupportClick }) => {
  return (
    <footer className="w-full text-center p-4 text-slate-500 animate-fade-in">
      <div className="max-w-7xl mx-auto flex flex-col justify-center items-center gap-2">
        <p className="max-w-2xl text-sm">
          This hub is a passion project. Consider supporting its development.
           <button 
              onClick={onSupportClick} 
              className="ml-2 font-semibold text-cyan-400 hover:text-cyan-300 transition-colors underline underline-offset-2"
            >
              Support Here
            </button>
        </p>
         <p className="text-xs mt-2">&copy; {new Date().getFullYear()} Mini-Game Hub. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default React.memo(Footer);