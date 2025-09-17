import React, { useState, useEffect, useMemo } from 'react';
import StyledButton from '../StyledButton';
import useLocalStorage from '../../hooks/useLocalStorage';

interface WordScrambleGameProps {
  onBack: () => void;
  onNewHighScore: (gameName: string, score: number) => void;
}

const WORD_LIST = ["GEMINI", "JAVASCRIPT", "REACT", "DEVELOPER", "COMPONENT", "STYLESHEET", "FRAMEWORK", "LIBRARY"];
const GAME_DURATION = 60; // seconds

const scrambleWord = (word: string): string => {
    const arr = word.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
}

const WordScrambleGame: React.FC<WordScrambleGameProps> = ({ onBack, onNewHighScore }) => {
    const [currentWord, setCurrentWord] = useState('');
    const [scrambledWord, setScrambledWord] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'over'>('idle');
    const [feedback, setFeedback] = useState('');
    const [highScore, setHighScore] = useLocalStorage('word-scramble-highscore', 0);
    const scoreKey = useMemo(() => Date.now(), [score]);

    const nextWord = () => {
        const newWord = WORD_LIST[Math.floor(Math.random() * WORD_LIST.length)];
        setCurrentWord(newWord);
        setScrambledWord(scrambleWord(newWord));
        setInputValue('');
    };
    
    useEffect(() => {
        if (gameState === 'playing' && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && gameState === 'playing') {
            setGameState('over');
            if (score > highScore) {
                setHighScore(score);
                onNewHighScore('Word Scramble', score);
            }
        }
    }, [timeLeft, gameState, score, highScore, onNewHighScore, setHighScore]);

    const startGame = () => {
        setScore(0);
        setTimeLeft(GAME_DURATION);
        nextWord();
        setGameState('playing');
        setFeedback('');
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.toUpperCase() === currentWord) {
            setScore(s => s + currentWord.length * 10);
            setFeedback('Correct!');
            setTimeout(() => {
                setFeedback('');
                nextWord();
            }, 800);
        } else {
            setFeedback('Try again!');
             setTimeout(() => setFeedback(''), 800);
        }
        setInputValue('');
    }

    return (
        <div className="flex flex-col items-center p-4 w-full max-w-md mx-auto text-center animate-fade-in-up">
          <h2 className="text-4xl font-bold mb-2">Word Scramble</h2>
          <p className="text-slate-400 mb-4">Unscramble the letters to form a word.</p>

           <div className="flex gap-8 mb-4 text-xl">
                <p>Score: <span key={scoreKey} className="font-bold text-cyan-400 animate-score-pop">{score}</span></p>
                <p>Time: <span className="font-bold text-red-400">{timeLeft}</span></p>
            </div>
            <p className="mb-4 text-lg">High Score: <span className="font-bold text-yellow-400">{highScore}</span></p>

            <div className="w-full h-64 bg-slate-800 rounded-lg flex flex-col items-center justify-center p-4">
                {gameState !== 'playing' ? (
                     <div className="flex flex-col items-center justify-center">
                        <h3 className="text-3xl font-bold text-white mb-4">
                            {gameState === 'over' ? `Game Over! Score: ${score}` : 'Ready?'}
                        </h3>
                        <StyledButton onClick={startGame}>
                            {gameState === 'over' ? 'Play Again' : 'Start Game'}
                        </StyledButton>
                    </div>
                ) : (
                    <>
                        <p className="text-4xl font-bold tracking-widest text-cyan-300 mb-8">{scrambledWord}</p>
                        <form onSubmit={handleSubmit}>
                            <input 
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="w-full p-3 text-center bg-slate-700 text-white rounded-md text-2xl uppercase focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                autoFocus
                            />
                            <button type="submit" className="hidden">Submit</button>
                        </form>
                        <p className={`mt-4 text-2xl font-bold h-8 ${feedback === 'Correct!' ? 'text-green-400' : 'text-yellow-400'}`}>
                            {feedback}
                        </p>
                    </>
                )}
            </div>

            <button onClick={onBack} className="mt-12 text-slate-400 hover:text-cyan-400 transition-colors">
                &larr; Back to Menu
            </button>
        </div>
    );
};

export default WordScrambleGame;
