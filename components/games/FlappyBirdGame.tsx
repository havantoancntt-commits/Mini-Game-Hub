import React, { useState, useEffect } from 'react';
import useInterval from '../../hooks/useInterval';
import StyledButton from '../StyledButton';
import useLocalStorage from '../../hooks/useLocalStorage';
import { playErrorSound, playSuccessSound } from '../../utils/audio';

interface FlappyBirdGameProps {
    onBack: () => void;
}

const GAME_WIDTH = 500;
const GAME_HEIGHT = 600;
const BIRD_SIZE = 30;
const GRAVITY = 0.6;
const JUMP_STRENGTH = 10;
const PIPE_WIDTH = 60;
const PIPE_GAP = 150;
const PIPE_SPEED = 4;

const FlappyBirdGame: React.FC<FlappyBirdGameProps> = ({ onBack }) => {
    const [birdPosition, setBirdPosition] = useState(GAME_HEIGHT / 2);
    const [birdVelocity, setBirdVelocity] = useState(0);
    const [pipes, setPipes] = useState<{ x: number, topHeight: number }[]>([]);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useLocalStorage('flappy-bird-hs', 0);
    const [gameState, setGameState] = useState<'start' | 'playing' | 'over'>('start');

    const resetGame = () => {
        setBirdPosition(GAME_HEIGHT / 2);
        setBirdVelocity(0);
        setPipes([{ x: GAME_WIDTH, topHeight: Math.random() * (GAME_HEIGHT - PIPE_GAP - 100) + 50 }]);
        setScore(0);
        setGameState('playing');
    };
    
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.type === 'click' || e.type === 'touchstart') {
                e.preventDefault();
                if (gameState === 'playing') {
                    setBirdVelocity(-JUMP_STRENGTH);
                } else if (gameState === 'start' || gameState === 'over') {
                    resetGame();
                }
            }
        };
        
        window.addEventListener('keydown', handleKeyPress);
        window.addEventListener('click', handleKeyPress);
        window.addEventListener('touchstart', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            window.removeEventListener('click', handleKeyPress);
            window.removeEventListener('touchstart', handleKeyPress);
        };
    }, [gameState]);


    const gameLoop = () => {
        if (gameState !== 'playing') return;

        // Bird physics
        const newVelocity = birdVelocity + GRAVITY;
        const newPosition = birdPosition + newVelocity;
        setBirdVelocity(newVelocity);
        setBirdPosition(newPosition);

        // Ground collision
        if (newPosition > GAME_HEIGHT - BIRD_SIZE) {
            playErrorSound();
            setGameState('over');
            return;
        }

        // Pipe logic
        const newPipes = pipes.map(pipe => ({ ...pipe, x: pipe.x - PIPE_SPEED }));
        
        // Add new pipe
        const lastPipe = newPipes[newPipes.length - 1];
        if (lastPipe.x < GAME_WIDTH - 250) {
            newPipes.push({
                x: GAME_WIDTH,
                topHeight: Math.random() * (GAME_HEIGHT - PIPE_GAP - 100) + 50
            });
        }
        
        // Remove old pipes and check for score
        const updatedPipes = newPipes.filter(pipe => {
            if (pipe.x + PIPE_WIDTH < 0) return false;
            if (pipe.x + PIPE_WIDTH < GAME_WIDTH / 2 - BIRD_SIZE / 2 && pipe.x + PIPE_WIDTH > GAME_WIDTH / 2 - BIRD_SIZE/2 - PIPE_SPEED ) {
                setScore(s => s + 1);
                playSuccessSound();
            }
            return true;
        });
        setPipes(updatedPipes);
        
        // Pipe collision
        for (const pipe of updatedPipes) {
            const birdLeft = GAME_WIDTH / 2 - BIRD_SIZE / 2;
            const birdRight = GAME_WIDTH / 2 + BIRD_SIZE / 2;
            const birdTop = newPosition;
            const birdBottom = newPosition + BIRD_SIZE;
            
            const pipeLeft = pipe.x;
            const pipeRight = pipe.x + PIPE_WIDTH;
            const pipeTop = pipe.topHeight;
            const pipeBottom = pipe.topHeight + PIPE_GAP;
            
            if (birdRight > pipeLeft && birdLeft < pipeRight && (birdTop < pipeTop || birdBottom > pipeBottom)) {
                playErrorSound();
                setGameState('over');
                return;
            }
        }
        
        if (score > highScore) {
            setHighScore(score);
        }
    };

    useInterval(gameLoop, 1000 / 60);

    return (
        <div className="flex flex-col items-center">
            <div className="mb-4 flex justify-between w-full max-w-lg text-xl font-bold text-slate-300">
                <div>Score: <span className="text-white">{score}</span></div>
                <div>Best: <span className="text-yellow-400">{highScore}</span></div>
            </div>
            <div className="bg-cyan-900 overflow-hidden relative border-2 border-slate-700" style={{ width: GAME_WIDTH, height: GAME_HEIGHT }}>
                {gameState === 'start' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-20">
                        <h2 className="text-4xl font-extrabold mb-4">Flappy Bird</h2>
                        <p className="text-xl">Press Space or Click to Start</p>
                    </div>
                )}
                {gameState === 'over' && (
                     <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-center z-20 animate-fade-in">
                        <h2 className="text-4xl font-extrabold text-red-500 mb-4">Game Over</h2>
                        <p className="text-xl mb-6">Your score: {score}</p>
                        <StyledButton onClick={resetGame}>Play Again</StyledButton>
                    </div>
                )}
                
                <div className="absolute bg-yellow-400 rounded-full" style={{
                    width: BIRD_SIZE,
                    height: BIRD_SIZE,
                    left: GAME_WIDTH / 2 - BIRD_SIZE / 2,
                    top: birdPosition,
                    transition: 'top 16ms linear'
                }}></div>

                {pipes.map((pipe, index) => (
                    <div key={index}>
                        <div className="absolute bg-emerald-500" style={{
                            left: pipe.x,
                            top: 0,
                            width: PIPE_WIDTH,
                            height: pipe.topHeight,
                            border: '2px solid #10B981'
                        }}></div>
                        <div className="absolute bg-emerald-500" style={{
                            left: pipe.x,
                            top: pipe.topHeight + PIPE_GAP,
                            width: PIPE_WIDTH,
                            height: GAME_HEIGHT - pipe.topHeight - PIPE_GAP,
                            border: '2px solid #10B981'
                        }}></div>
                    </div>
                ))}
            </div>
            <div className="mt-8">
                <button onClick={onBack} className="text-slate-400 hover:text-cyan-400 transition-colors">
                    &larr; Back to Menu
                </button>
            </div>
        </div>
    );
};

export default FlappyBirdGame;
