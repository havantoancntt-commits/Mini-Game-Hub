import React, { useState, useEffect, useCallback } from 'react';
// Correct import statement for GoogleGenAI
import { GoogleGenAI } from '@google/genai';
import StyledButton from '../StyledButton';
import useLocalStorage from '../../hooks/useLocalStorage';
import { playSuccessSound, playErrorSound, playWinSound } from '../../utils/audio';

// As per instructions, API_KEY is expected to be in process.env.
const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
    // Correct initialization with named apiKey parameter
    ai = new GoogleGenAI({apiKey: API_KEY});
} else {
    console.error("API_KEY environment variable not set. Word Scramble will use a fallback list of words.");
}

const FALLBACK_WORDS = ["react", "gemini", "game", "typescript", "tailwind"];

interface WordScrambleGameProps {
  onBack: () => void;
}

const scrambleWord = (word: string): string => {
  const a = word.split('');
  const n = a.length;

  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  
  const scrambled = a.join('');
  // Ensure the word is actually scrambled and not the same as original
  if (scrambled === word) {
    return scrambleWord(word);
  }
  return scrambled;
};

const WordScrambleGame: React.FC<WordScrambleGameProps> = ({ onBack }) => {
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useLocalStorage('word-scramble-hs', 0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchNewWord = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setInputValue('');
    try {
        if (!ai) {
            throw new Error("Gemini AI not initialized.");
        }
      // Correct API call using ai.models.generateContent
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: 'Generate a single, common English word between 5 and 8 letters long, suitable for a word scramble game. Only return the word itself, nothing else.',
      });
      // Correct way to get text from response
      const newWord = response.text.trim().toLowerCase().replace(/[^a-z]/g, '');
      if (newWord.length < 5 || newWord.length > 8) {
          throw new Error("Generated word has invalid length.");
      }
      setCurrentWord(newWord);
      setScrambledWord(scrambleWord(newWord));
    } catch (err) {
      console.error('Failed to fetch word from Gemini API:', err);
      setError('Could not fetch a new word. Using a fallback.');
      const fallbackWord = FALLBACK_WORDS[Math.floor(Math.random() * FALLBACK_WORDS.length)];
      setCurrentWord(fallbackWord);
      setScrambledWord(scrambleWord(fallbackWord));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNewWord();
  }, [fetchNewWord]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.toLowerCase() === currentWord) {
      playSuccessSound();
      const newScore = score + 1;
      setScore(newScore);
      if (newScore > highScore) {
        setHighScore(newScore);
        playWinSound();
      }
      fetchNewWord();
    } else {
      playErrorSound();
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center text-xl animate-pulse">Fetching a new word...</div>;
    }
    if (error && !currentWord) {
        return (
            <div className="text-center text-xl text-red-500">
                <p>{error}</p>
                <StyledButton onClick={fetchNewWord} className="mt-4">Try Again</StyledButton>
            </div>
        );
    }
    return (
      <>
        <div className="mb-6 flex justify-between w-full max-w-sm text-xl font-bold text-slate-300">
            <div>Score: <span className="text-white">{score}</span></div>
            <div>Best: <span className="text-yellow-400">{highScore}</span></div>
        </div>

        <div className="bg-slate-800 rounded-lg p-8 mb-6 text-center">
            <p className="text-slate-400 mb-2">Unscramble the word:</p>
            <p className="text-5xl font-bold tracking-widest text-cyan-400">{scrambledWord}</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-sm">
            <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full p-4 bg-slate-700 text-white text-2xl text-center rounded-lg border-2 border-slate-600 focus:border-cyan-400 focus:ring-0 focus:outline-none transition-colors mb-6"
                placeholder="Your guess"
                autoFocus
            />
            <StyledButton type="submit" disabled={!inputValue}>Submit</StyledButton>
        </form>
      </>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 w-full max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold mb-8">Word Scramble</h2>
        {error && <p className="text-sm text-amber-500 mb-4">{error}</p>}
        {renderContent()}
        <div className="mt-12">
            <button onClick={onBack} className="text-slate-400 hover:text-cyan-400 transition-colors">
            &larr; Back to Menu
            </button>
        </div>
    </div>
  );
};

export default WordScrambleGame;
