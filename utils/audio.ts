let audioContext: AudioContext;
let isAudioInitialized = false;

const initializeAudio = () => {
  if (isAudioInitialized || typeof window === 'undefined') return;
  try {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    // Resume context on user interaction
    const unlockAudio = () => {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      document.removeEventListener('click', unlockAudio);
      document.removeEventListener('touchstart', unlockAudio);
    };
    document.addEventListener('click', unlockAudio);
    document.addEventListener('touchstart', unlockAudio);
    isAudioInitialized = true;
  } catch (e) {
    console.error("Web Audio API is not supported in this browser.");
  }
};

const playSound = (type: OscillatorType, frequency: number, duration: number, volume = 0.1) => {
  if (!isAudioInitialized) initializeAudio();
  if (!audioContext || audioContext.state !== 'running') return;

  try {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration);
  } catch (e) {
    console.error("Failed to play sound.", e);
  }
};

export const playClickSound = () => playSound('triangle', 500, 0.08, 0.05);
export const playSuccessSound = () => playSound('sine', 800, 0.2, 0.08);
export const playErrorSound = () => playSound('square', 200, 0.3);
export const playMatchSound = () => {
  playSound('sine', 600, 0.1);
  setTimeout(() => playSound('sine', 880, 0.15), 80);
};
export const playWinSound = () => {
  playSound('sine', 523.25, 0.1); // C5
  setTimeout(() => playSound('sine', 659.25, 0.1), 120); // E5
  setTimeout(() => playSound('sine', 783.99, 0.1), 240); // G5
  setTimeout(() => playSound('sine', 1046.50, 0.2), 360); // C6
};
