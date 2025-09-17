import React, { useState, useEffect, useRef } from 'react';
import StyledButton from '../StyledButton';
import useLocalStorage from '../../hooks/useLocalStorage';

interface TypingSpeedGameProps {
  onBack: () => void;
  onNewHighScore: (gameName: string, score: number) => void;
}

const TEXT_SAMPLES = [
  "The quick brown fox jumps over the lazy dog.",
  "Never underestimate the power of a good book.",
  "The journey of a thousand miles begins with a single step.",
  "Technology has revolutionized the way we live and work.",
  "The sun always shines brightest after the rain."
];

const getRandomText = () => TEXT_SAMPLES[Math.floor(Math.random() * TEXT_SAMPLES.length)];

const TypingSpeedGame: React.FC<TypingSpeedGameProps> = ({ onBack, onNewHighScore }) => {
  const [text, setText] = useState(getRandomText());
  const [inputValue, setInputValue] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [isFinished, setIsFinished] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [highScore, setHighScore] = useLocalStorage<number>('typing-speed-highscore', 0);

  useEffect(() => {
    if (!isFinished) {
      inputRef.current?.focus();
    }
  }, [isFinished]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;

    const currentVal = e.target.value;
    
    if (!startTime) {
      setStartTime(Date.now());
    }

    setInputValue(currentVal);

    if (currentVal.length >= text.length) {
      finishGame(currentVal);
    }
  };

  const finishGame = (finalValue: string) => {
    if (!startTime) return;
    const endTime = Date.now();
    const durationInMinutes = (endTime - startTime) / 1000 / 60;
    const wordsTyped = text.split(' ').length;
    const calculatedWpm = durationInMinutes > 0 ? Math.round(wordsTyped / durationInMinutes) : 0;
    setWpm(calculatedWpm);

    let correctChars = 0;
    const cleanText = text.substring(0, finalValue.length);
    for (let i = 0; i < cleanText.length; i++) {
      if (cleanText[i] === finalValue[i]) {
        correctChars++;
      }
    }
    const calculatedAccuracy = Math.round((correctChars / cleanText.length) * 100);
    setAccuracy(calculatedAccuracy);
    setIsFinished(true);
    
    if (calculatedWpm > highScore) {
      setHighScore(calculatedWpm);
      onNewHighScore('Typing Speed', calculatedWpm);
    }
  };

  const resetGame = () => {
    setText(getRandomText());
    setInputValue('');
    setStartTime(null);
    setWpm(0);
    setAccuracy(100);
    setIsFinished(false);
  };

  const renderText = () => {
    return text.split('').map((char, index) => {
      let colorClass = 'text-slate-500';
      if (index < inputValue.length) {
        colorClass = char === inputValue[index] ? 'text-green-400' : 'text-red-500 underline';
      }
      return <span key={index} className={colorClass}>{char}</span>;
    });
  };

  return (
    <div className="flex flex-col items-center p-6 sm:p-8 w-full max-w-3xl mx-auto text-center bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-700/50 animate-fade-in-up">
      <h2 className="text-4xl font-bold mb-4">Typing Speed Test</h2>
      <p className="text-slate-400 mb-8">Type the text below as fast and accurately as you can.</p>

      <div className="w-full p-4 sm:p-6 bg-slate-900/50 rounded-lg text-lg sm:text-2xl tracking-wider font-mono mb-6 border border-slate-700">
        <p>{renderText()}</p>
      </div>

      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        className="w-full p-4 bg-slate-700/80 text-white rounded-md text-xl focus:outline-none focus:ring-2 focus:ring-cyan-500"
        placeholder={isFinished ? 'Game Over!' : 'Start typing here...'}
        disabled={isFinished}
        autoFocus
      />
      
      {isFinished ? (
        <div className="mt-8 text-center animate-fade-in">
          <h3 className="text-3xl font-bold text-cyan-400 mb-4">Results</h3>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 text-white">
            <div className="w-full sm:w-auto">
              <p className="text-4xl font-bold animate-score-pop">{wpm}</p>
              <p className="text-slate-400">WPM</p>
            </div>
            <div className="w-full sm:w-auto">
              <p className="text-4xl font-bold animate-score-pop">{accuracy}%</p>
              <p className="text-slate-400">Accuracy</p>
            </div>
          </div>
           <p className="mt-4 text-lg">High Score: <span className="font-bold text-yellow-400">{highScore}</span> WPM</p>
          <StyledButton onClick={resetGame} className="mt-6">
            Try Again
          </StyledButton>
        </div>
      ) : (
         <p className="mt-4 text-lg">High Score: <span className="font-bold text-yellow-400">{highScore}</span> WPM</p>
      )}

      <button onClick={onBack} className="group mt-12 text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        <span>Back to Menu</span>
      </button>
    </div>
  );
};

export default TypingSpeedGame;