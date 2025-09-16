import React, { useState, useEffect, useRef, useCallback } from 'react';
import StyledButton from '../StyledButton';
import useLocalStorage from '../../hooks/useLocalStorage';
import { playSuccessSound, playWinSound } from '../../utils/audio';

interface TypingSpeedGameProps {
  onBack: () => void;
}

const WORDS = [
  "react", "javascript", "tailwind", "component", "state", "props", "hook", "effect", "virtual", "render",
  "developer", "interface", "typescript", "module", "build", "package", "function", "variable", "const",
  "array", "object", "class", "style", "design", "responsive", "mobile", "desktop", "application", "web",
  "game", "hub", "mini", "addictive", "engaging", "world", "class", "player", "interface", "experience"
];
const GAME_DURATION = 30; // seconds

const generateWords = (count: number) => {
  return Array.from({ length: count }, () => WORDS[Math.floor(Math.random() * WORDS.length)]);
};

const getRating = (wpm: number) => {
  if (wpm < 20) return { title: "Typing Turtle", color: "text-slate-400" };
  if (wpm < 40) return { title: "Keyboard Coder", color: "text-cyan-400" };
  if (wpm < 60) return { title: "Swift Scripter", color: "text-emerald-400" };
  if (wpm < 80) return { title: "Typing Titan", color: "text-amber-400" };
  return { title: "Word Weaver Wizard", color: "text-fuchsia-500" };
};

const TypingSpeedGame: React.FC<TypingSpeedGameProps> = ({ onBack }) => {
  const [words, setWords] = useState<string[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [isTyping, setIsTyping] = useState(false);
  const [correctWords, setCorrectWords] = useState(0);
  const [totalChars, setTotalChars] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [highScore, setHighScore] = useLocalStorage('typing-speed-hs', 0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const wpm = totalChars > 0 && (GAME_DURATION - timeLeft > 0) ? Math.round((totalChars / 5) / ((GAME_DURATION - timeLeft) / 60)) : 0;

  const resetGame = useCallback(() => {
    setWords(generateWords(100));
    setCurrentWordIndex(0);
    setInputValue('');
    setTimeLeft(GAME_DURATION);
    setIsTyping(false);
    setCorrectWords(0);
    setTotalChars(0);
    setIsFinished(false);
    setIsNewHighScore(false);
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    if (isTyping && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isFinished) {
      if (timerRef.current) clearInterval(timerRef.current);
      playWinSound();
      setIsTyping(false);
      setIsFinished(true);
      const finalWpm = totalChars > 0 ? Math.round((totalChars / 5) / (GAME_DURATION / 60)) : 0;
      if (finalWpm > highScore) {
        setHighScore(finalWpm);
        setIsNewHighScore(true);
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTyping, timeLeft, isFinished, totalChars, highScore, setHighScore]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;
    const value = e.target.value;

    if (!isTyping && value.trim().length > 0) {
      setIsTyping(true);
    }

    if (value.endsWith(' ')) {
      const typedWord = value.trim();
      if (typedWord === words[currentWordIndex]) {
        playSuccessSound();
        setCorrectWords(prev => prev + 1);
        setTotalChars(prev => prev + typedWord.length);
      }
      setCurrentWordIndex(prev => prev + 1);
      setInputValue('');
    } else {
      setInputValue(value);
    }
  };

  const getWordClass = (index: number) => {
    if (index < currentWordIndex) return 'text-slate-500';
    if (index === currentWordIndex) {
      const isCorrect = words[index].startsWith(inputValue);
      return `font-bold rounded p-1 ${isCorrect ? 'text-cyan-400' : 'text-red-500 bg-red-500/20'}`;
    }
    return 'text-slate-300';
  };
  
  if (isFinished) {
      const finalWpm = totalChars > 0 ? Math.round((totalChars / 5) / (GAME_DURATION / 60)) : 0;
      const rating = getRating(finalWpm);
      return (
          <div className="text-center flex flex-col items-center animate-fade-in-up">
              <h2 className="text-4xl font-bold mb-4">Time's Up!</h2>
              {isNewHighScore && <p className="text-2xl font-bold text-yellow-400 mb-4 animate-bounce">New High Score!</p>}
              <div className="text-2xl text-slate-300 mb-2">Your score:</div>
              <div className="text-6xl font-extrabold text-cyan-400 mb-4">{finalWpm} WPM</div>
              <div className={`text-3xl font-bold mb-8 ${rating.color}`}>{rating.title}</div>
              <p className="text-slate-400 mb-8">You typed {correctWords} words correctly. Best: {highScore} WPM.</p>
              <StyledButton onClick={resetGame}>Play Again</StyledButton>
              <div className="mt-12">
                  <button onClick={onBack} className="text-slate-400 hover:text-cyan-400 transition-colors">
                    &larr; Back to Menu
                  </button>
              </div>
          </div>
      );
  }

  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-full max-w-3xl bg-slate-800 rounded-lg p-4 mb-6">
        <div className="flex justify-between items-center text-xl font-bold">
          <div className={`text-slate-300 transition-colors ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : ''}`}>
            Time: <span className="text-white">{timeLeft}s</span>
          </div>
          <div className="text-slate-300">WPM: <span className="text-white">{wpm}</span></div>
        </div>
      </div>

      <div className="w-full max-w-3xl bg-slate-800 rounded-lg p-6 text-2xl leading-relaxed tracking-wider font-mono h-48 overflow-hidden" onClick={() => inputRef.current?.focus()}>
        <div className="flex flex-wrap gap-x-3 gap-y-4">
            {words.slice(currentWordIndex).slice(0, 30).map((word, index) => (
              <span key={index} className={getWordClass(currentWordIndex + index)}>
                {word}
              </span>
            ))}
        </div>
      </div>

      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleChange}
        className="mt-6 w-full max-w-3xl p-4 bg-slate-700 text-white text-2xl rounded-lg border-2 border-slate-600 focus:border-cyan-400 focus:ring-0 focus:outline-none transition-colors"
        placeholder={!isTyping ? "Start typing here..." : ""}
        autoFocus
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck="false"
      />
      <div className="mt-12">
         <button onClick={onBack} className="text-slate-400 hover:text-cyan-400 transition-colors">
           &larr; Back to Menu
         </button>
      </div>
    </div>
  );
};

export default TypingSpeedGame;