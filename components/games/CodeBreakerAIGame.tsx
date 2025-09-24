import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import StyledButton from '../StyledButton';
import useLocalStorage from '../../hooks/useLocalStorage';
import { playSuccessSound, playWinSound, playGameOverSound, playClickSound } from '../../utils/audio';

interface CodeBreakerAIGameProps {
  onBack: () => void;
  onNewHighScore: (gameName: string, score: string) => void;
}

const COLORS = ['bg-red-500', 'bg-green-500', 'bg-blue-500', 'bg-yellow-400', 'bg-orange-500', 'bg-purple-500'];
const COLOR_NAMES = ['red', 'green', 'blue', 'yellow', 'orange', 'purple'];
const CODE_LENGTH = 4;
const MAX_ATTEMPTS = 10;

type Feedback = { perfect: number; colorOnly: number };

// FIX: Moved GuessRow component outside of CodeBreakerAIGame component.
// This prevents it from being re-declared on every render, which fixes the TypeScript error with the `key` prop
// and is also better for performance.
const GuessRow = ({ guess, feedback }: { guess: string[], feedback?: Feedback }) => (
  <div className="flex items-center gap-2 sm:gap-4">
    <div className="flex gap-2 flex-grow">
      {Array.from({ length: CODE_LENGTH }).map((_, i) => (
        <div key={i} className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-slate-600 flex-shrink-0 ${guess[i] || 'bg-slate-700/50'}`} />
      ))}
    </div>
    <div className="grid grid-cols-2 gap-1 w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
      {feedback && Array.from({ length: CODE_LENGTH }).map((_, i) => (
        <div key={i} className={`w-full h-full rounded-full border border-slate-600
          ${i < feedback.perfect ? 'bg-slate-100' : ''}
          ${i >= feedback.perfect && i < feedback.perfect + feedback.colorOnly ? 'bg-slate-500' : ''}
        `} />
      ))}
    </div>
  </div>
);

const CodeBreakerAIGame: React.FC<CodeBreakerAIGameProps> = ({ onBack, onNewHighScore }) => {
  const [secretCode, setSecretCode] = useState<string[]>([]);
  const [guesses, setGuesses] = useState<string[][]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [gameState, setGameState] = useState<'loading' | 'playing' | 'won' | 'lost'>('loading');
  const [isCheckingGuess, setIsCheckingGuess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [highScore, setHighScore] = useLocalStorage<number | null>('code-breaker-highscore', null);
  const attemptsLeft = MAX_ATTEMPTS - guesses.length;

  const resetGame = useCallback(async () => {
    setGameState('loading');
    setCurrentGuess([]);
    setGuesses([]);
    setFeedback([]);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      const schema = {
        type: Type.OBJECT,
        properties: { code: { type: Type.ARRAY, items: { type: Type.STRING } } },
        required: ["code"],
      };
      const prompt = `Generate a secret code for a Mastermind-style game. The code must be an array of ${CODE_LENGTH} colors. Choose colors from this list: ${JSON.stringify(COLOR_NAMES)}. Duplicates are allowed.`;
      
      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: schema },
      });
      const responseJson = JSON.parse(result.text);
      
      const colorMap: { [key: string]: string } = Object.fromEntries(COLORS.map(c => [c.split('-')[1], c]));
      const generatedCode = responseJson.code.map((color: string) => colorMap[color.toLowerCase()]);

      if (generatedCode.length !== CODE_LENGTH || generatedCode.includes(undefined)) {
        throw new Error("AI returned invalid code format.");
      }

      setSecretCode(generatedCode);
      setGameState('playing');
    } catch (e) {
      console.error("Failed to generate code with AI", e);
      setError("Could not generate a new code. Please check your connection or API key and try again.");
      setGameState('lost');
    }
  }, []);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const handleColorSelect = (color: string) => {
    if (currentGuess.length < CODE_LENGTH) {
      playClickSound();
      setCurrentGuess(prev => [...prev, color]);
    }
  };

  const handleUndo = () => {
    playClickSound();
    setCurrentGuess(prev => prev.slice(0, -1));
  };
  
  const handleGuessSubmit = async () => {
    if (currentGuess.length !== CODE_LENGTH || isCheckingGuess) return;
    
    setIsCheckingGuess(true);
    setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      const schema = {
        type: Type.OBJECT,
        properties: {
          perfect: { type: Type.NUMBER, description: "Correct color in the correct position." },
          colorOnly: { type: Type.NUMBER, description: "Correct color in the wrong position." },
        },
        required: ["perfect", "colorOnly"],
      };
      
      const toColorName = (cssClass: string) => cssClass.split('-')[1];
      const prompt = `You are a Mastermind game logic engine. The secret code is ${JSON.stringify(secretCode.map(toColorName))}. The player's guess is ${JSON.stringify(currentGuess.map(toColorName))}. Compare the guess to the code. Provide the number of 'perfect' matches (correct color and position) and 'colorOnly' matches (correct color, wrong position).`;

      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: "application/json", responseSchema: schema },
      });

      const newFeedback: Feedback = JSON.parse(result.text);

      setGuesses(prev => [...prev, currentGuess]);
      setFeedback(prev => [...prev, newFeedback]);
      setCurrentGuess([]);
      playSuccessSound();

      if (newFeedback.perfect === CODE_LENGTH) {
        setGameState('won');
        playWinSound();
        const attempts = guesses.length + 1;
        if (highScore === null || attempts < highScore) {
          setHighScore(attempts);
          onNewHighScore('Code Breaker AI', `${attempts} attempts`);
        }
      } else if (guesses.length + 1 >= MAX_ATTEMPTS) {
        setGameState('lost');
        playGameOverSound();
      }
    } catch (err) {
      console.error("Error checking guess with Gemini:", err);
      setError("Could not get feedback from AI. Please try again.");
    } finally {
      setIsCheckingGuess(false);
    }
  };

  const renderOverlay = () => {
    if (gameState === 'loading') {
      return (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg">
          <div className="w-12 h-12 border-4 border-dashed rounded-full animate-spin border-cyan-400"></div>
          <p className="mt-4 text-slate-300">AI is generating a secret code...</p>
        </div>
      );
    }
    if (gameState === 'won' || gameState === 'lost') {
       return (
         <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10 rounded-lg text-center p-4">
          <h3 className={`text-3xl font-bold mb-2 ${gameState === 'won' ? 'text-green-400' : 'text-red-500'}`}>
            {gameState === 'won' ? 'You Won!' : "Game Over"}
          </h3>
          <p className="text-slate-300 mb-2">
             {gameState === 'won' ? `You cracked the code in ${guesses.length} attempts!` : 'The AI has bested you!'}
          </p>
          <div className="flex items-center gap-2 mb-4">
            <p>The code was:</p>
            {secretCode.map((color, i) => <div key={i} className={`w-6 h-6 rounded-full ${color}`} />)}
          </div>
          <StyledButton onClick={resetGame}>Play Again</StyledButton>
         </div>
       )
    }
    return null;
  }

  return (
    <div className="flex flex-col items-center p-4 sm:p-8 w-full max-w-lg mx-auto text-center bg-slate-800/60 backdrop-blur-md rounded-2xl border border-slate-700/50 animate-fade-in-up">
      <h2 className="text-4xl font-bold mb-2">Code Breaker AI</h2>
      <p className="text-slate-400 mb-4">The AI has a secret code. Can you crack it?</p>
      <div className="flex gap-8 mb-4">
          <p aria-live="polite">Attempts Left: <span className="font-bold text-cyan-400">{attemptsLeft}</span></p>
          <p>Best: <span className="font-bold text-yellow-400">{highScore ? `${highScore} attempts` : 'N/A'}</span></p>
      </div>
      
      <div className="w-full bg-slate-900/70 border-2 border-slate-600 rounded-lg p-4 relative space-y-2">
        {renderOverlay()}
        <div className="space-y-2 overflow-y-auto max-h-80 pr-2">
          {guesses.map((g, i) => <GuessRow key={i} guess={g} feedback={feedback[i]} />)}
        </div>
        {gameState === 'playing' && <GuessRow guess={currentGuess} />}
      </div>
      
      <div className="w-full mt-6">
        <div className="flex justify-center gap-2 mb-4">
            {COLORS.map(color => (
                <button key={color} onClick={() => handleColorSelect(color)} className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${color} transform hover:scale-110 transition-transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed`} disabled={gameState !== 'playing'} />
            ))}
        </div>
        <div className="flex justify-center gap-4">
            <StyledButton onClick={handleUndo} disabled={gameState !== 'playing' || currentGuess.length === 0}>Undo</StyledButton>
            <StyledButton onClick={handleGuessSubmit} disabled={gameState !== 'playing' || currentGuess.length !== CODE_LENGTH || isCheckingGuess}>
                {isCheckingGuess ? 'Checking...' : 'Submit Guess'}
            </StyledButton>
        </div>
        {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
      </div>

      <button onClick={onBack} className="group mt-12 text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        <span>Back to Menu</span>
      </button>
    </div>
  );
};

export default CodeBreakerAIGame;