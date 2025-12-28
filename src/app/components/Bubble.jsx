// components/BubbleGame.jsx
"use client";
import ParticlesBackground from './ParticlesBackground';
import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './BubbleGame.module.css';

const BubbleGame = ({ onRestart }) => {

  // Game state
  const [gameState, setGameState] = useState('idle');
  const [numbers, setNumbers] = useState([]);
  const [positions, setPositions] = useState([]);
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(false);
  const [clickedNumbers, setClickedNumbers] = useState([]);
  const [correctNumbers, setCorrectNumbers] = useState([]);
  const [countdown, setCountdown] = useState(3);
  const [showPerfectRound, setShowPerfectRound] = useState(false);
const [won, setWon] = useState(false);
const [gameStarted, setGameStarted] = useState(false);
const [roundTimer, setRoundTimer] = useState(10); // current timer countdown
const [timerSpeed, setTimerSpeed] = useState(10000); // round duration in ms
const roundTimerRef = useRef(null); // ref to store interval





// music
  const audioRef = useRef(null);           // background music
  const correctAudioRef = useRef(null);
  const wrongAudioRef = useRef(null);
  const gameOverAudioRef = useRef(null);
  const winAudioRef = useRef(null);
  const startSoundRef = useRef(null);
const returnSoundRef = useRef(null);
const tickAudioRef = useRef(null);

useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.hidden) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(() => {});
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}, []);





  const [showRoundScreen, setShowRoundScreen] = useState(false);
const [perfectRound, setPerfectRound] = useState(false); // For suggestion #5

// PASTE INSIDE startRound FUNCTION (replace your current one)

  // Configuration
  const initialCount = 3;
  const maxRound = 20;
  const initialRevealTime = 3000;
  const minRevealTime = 1000;
// max 7 seconds (7000 ms)

  
const [highScore, setHighScore] = useState(0);

useEffect(() => {
  const savedHighScore = localStorage.getItem('highScore');
  if (savedHighScore) setHighScore(parseInt(savedHighScore));
}, []);
  
  const vibrate = (pattern = 200) => {
  if (navigator.vibrate) navigator.vibrate(pattern);
};



  useEffect(() => {
    if (!audioRef.current) return;

    let targetVolume;
    if (gameState === 'playing') {
      targetVolume = 1.0;  // loud when playing
    } else if (gameState === 'showing' || gameState === 'idle') {
      targetVolume = 0.3;  // quieter during countdown or idle
    } else if (gameState === 'gameover') {
      targetVolume = 0.1;  // very low on game over
    } else {
      targetVolume = 0.1;  // fallback volume
    }

    const duration = 1000; // 1 second fade
    const stepTime = 50;
    const steps = duration / stepTime;
    const volumeStep = (targetVolume - audioRef.current.volume) / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      if (audioRef.current) {
        audioRef.current.volume = Math.min(
          Math.max(audioRef.current.volume + volumeStep, 0),
          1
        );
      }
      currentStep++;
      if (currentStep >= steps) clearInterval(interval);
    }, stepTime);

    return () => clearInterval(interval);
  }, [gameState]);

// Call vibrate() on correct/wrong answers
  // Generate random positions
const generatePositions = useCallback((count) => {
  const positions = [];
  
  const minDistanceX = 20; // horizontal minimum distance in %
  const minDistanceY = 25; // vertical minimum distance in %

  function distance(pos1, pos2) {
    const dx = pos1.left - pos2.left;
    const dy = pos1.top - pos2.top;
    // Use separate x and y checks for oval spacing
    return Math.abs(dx) > minDistanceX || Math.abs(dy) > minDistanceY;
  }

  for (let i = 0; i < count; i++) {
    let newPos;
    let tries = 0;
    do {
      newPos = {
        left: 10 + Math.random() * 80,  // 10% to 90%
        top: 15 + Math.random() * 70    // 15% to 85%
      };
      tries++;
      if (tries > 200) break; // fail-safe to avoid infinite loops
    } while (!positions.every(pos => distance(pos, newPos))); // ensure all existing positions are far enough
    positions.push(newPos);
  }

  return positions;
}, []);



  // Generate unique numbers
  const generateNumbers = useCallback((count) => {
    const nums = new Set();
    while (nums.size < count) {
      nums.add(Math.floor(Math.random() * 21));
    }
    return Array.from(nums);
  }, []);


const startRound = useCallback((roundNum) => {
  setShowRoundScreen(true);
  setCountdown(3);

  let counter = 3;
  const interval = setInterval(() => {
    counter -= 1;
    if (counter === 0) {
      clearInterval(interval);
      setShowRoundScreen(false);

      const count = 4;
      const nums = generateNumbers(count);
      const pos = generatePositions(count);
      setNumbers(nums);
      setPositions(pos);
      setCurrentStep(0);
      setError(false);
      setClickedNumbers([]);
      setCorrectNumbers([]);
      setGameState('showing');

      const revealTime = Math.max(initialRevealTime - (roundNum - 1) * 500, minRevealTime);

      setTimeout(() => {
        setGameState('playing');

        // ----------------- START ROUND TIMER -----------------
        const duration = Math.max(10000 - (roundNum - 1) * 1000, 5000); // 10s → 5s max speed
        setTimerSpeed(duration);
        setRoundTimer(duration / 1000);

        // Clear previous timer if exists
        if (roundTimerRef.current) clearInterval(roundTimerRef.current);

        let timer = duration / 1000;
        roundTimerRef.current = setInterval(() => {
          timer -= 1;
          setRoundTimer(timer);
        // When game over happens, also reset the countdown
if (timer <= 0) {
  clearInterval(roundTimerRef.current);
  roundTimerRef.current = null;

  setError(true);
  setGameState('gameover');
  setCountdown(0); // hide countdown
  gameOverAudioRef.current?.play();
}

        }, 1000);

      }, revealTime);

    } else {
      setCountdown(counter);
    }
  }, 500);
}, [generateNumbers, generatePositions]);


const startGame = useCallback(() => {
  setGameStarted(true);
  setScore(0);
  setRound(1);
  setClickedNumbers([]);
  setCorrectNumbers([]);
  setRoundTimer(10);        // reset timer
  if (roundTimerRef.current) {
    clearInterval(roundTimerRef.current);
    roundTimerRef.current = null;
  }
  startRound(1);
  if (audioRef.current) {
    audioRef.current.play().catch(() => {});
  }
}, [startRound]);



  // Start new round
// Update the startRound function in your BubbleGame component





  // Handle bubble click
const handleClick = (num) => {
  if (gameState !== 'playing') return;

  const sorted = [...numbers].sort((a, b) => a - b);

  // Track clicked numbers
  setClickedNumbers(prev => [...prev, num]);

  if (num === sorted[currentStep]) {
    // ✅ Correct click
    setCorrectNumbers(prev => [...prev, num]);
    vibrate(100);
    correctAudioRef.current?.play();

    // Check if round is complete
    if (currentStep + 1 === sorted.length) {
      const updatedScore = score + numbers.length;
      const newRound = round + 1;

      // Update high score
      if (updatedScore > highScore) {
        localStorage.setItem('highScore', updatedScore);
        setHighScore(updatedScore);
      }
      setScore(updatedScore);

      // Perfect round celebration
     // Perfect round celebration
if (!error) {
  setShowPerfectRound(true);

  // Stop the current round timer immediately
  if (roundTimerRef.current) {
    clearInterval(roundTimerRef.current);
    roundTimerRef.current = null;
    setRoundTimer(0); // reset timer display
  }

  setTimeout(() => setShowPerfectRound(false), 1000);
}


      if (newRound > maxRound) {
        // 🎉 Player won
        setWon(true);
        setGameState('gameover');
        winAudioRef.current?.play();
      } else {
        // Start next round
        setRound(newRound);
        startRound(newRound);
      }
    } else {
      // Move to next number in sequence
      setCurrentStep(prev => prev + 1);
    }
  } else {
    // ❌ Wrong click → immediate game over
    setError(true);
    vibrate([200, 100, 200]);
    wrongAudioRef.current?.play();

    // Optional short delay for shake animation
    setTimeout(() => {
      setGameState('gameover');
      gameOverAudioRef.current?.play();
    }, 300);
  }
};


// And add this useEffect somewhere inside your component to handle health increment:




  return (
    
    <div className={styles.container}>
      <ParticlesBackground />
       {/* Background music */}
      <audio ref={audioRef} src="/bgmusic.mp3" loop preload="auto" />

      {/* Sound effects */}
      <audio ref={tickAudioRef} src="/gametimer.mp3" preload="auto" />

      <audio ref={correctAudioRef} src="/tap.wav" preload="auto" />
      <audio ref={wrongAudioRef} src="/error.mp3" preload="auto" />
      <audio ref={gameOverAudioRef} src="/over.wav" preload="auto" />
      <audio ref={winAudioRef} src="/win.wav" preload="auto" />
  <audio ref={startSoundRef} src="/start.wav" />
<audio ref={returnSoundRef} src="/return.wav" />


      <div className={styles.header}>
        <div className={styles.icon}>🧠</div>
        <div className={styles.roundTimer}>
  ⏱ {roundTimer}s
</div>

       

        <div className={styles.score}>Score: {score}
</div>
        <div className={styles.icon}>☰</div>
      </div>



      <div className={styles.bubblesContainer}>
        {numbers.map((num, i) => (
          <button
            key={i}
            className={`${styles.bubble} ${error ? styles.error : ''} ${
              clickedNumbers.includes(num) ? styles.clicked : ''
            } ${correctNumbers.includes(num) ? styles.correct : ''}`}
            style={{
              left: `${positions[i]?.left || 0}%`,
              top: `${positions[i]?.top || 0}%`
            }}
            onClick={() => handleClick(num)}
          >
            <span className={styles.number}>
  {(gameState === 'showing' || gameState === 'gameover' || clickedNumbers.includes(num))
    ? num
    : ''}
</span>

            {correctNumbers.includes(num) && (
              <span className={styles.checkmark}>✓</span>
            )}
          </button>
        ))}
      </div>

      {gameState === 'idle' && (
        <div className={styles.startScreen}>
          <button onClick={() => {
  if (startSoundRef.current) {
    startSoundRef.current.currentTime = 0;
    startSoundRef.current.play().catch(() => {});
  }
  startGame();
}}>Start Game</button>

        </div>
      )}

    {gameState === 'gameover' && (
  <div className={styles.gameOverScreen}>
    {won ? (
      <>
        <h2>🎉 Congratulations, You Won! 🎉</h2>
        <p>Final Score: {score}</p>
      </>
    ) : (
      <>
        <h2>Game Over</h2>
        <p>Score: {score}</p>
      </>
    )}
 <button onClick={() => {
  // Stop all audio before restarting
  winAudioRef.current?.pause();
  winAudioRef.current.currentTime = 0;
  gameOverAudioRef.current?.pause();
  gameOverAudioRef.current.currentTime = 0;
  wrongAudioRef.current?.pause();
  wrongAudioRef.current.currentTime = 0;
  correctAudioRef.current?.pause();
  correctAudioRef.current.currentTime = 0;

  if (returnSoundRef.current) {
    returnSoundRef.current.currentTime = 0;
    returnSoundRef.current.play().catch(() => {});
  }

  setWon(false); // reset winning state
  startGame();
}}>
  Restart
</button>

  </div>
  
)}

{showRoundScreen && (
  <div className={styles.roundTransition}>
    <h2>Round {round}</h2>
    <div className={styles.countdown}>{countdown}</div>
  </div>
)}


{showPerfectRound && (
  <div className={styles.perfectRoundCelebration}>
    🎉 Perfect Round! 🎉
  </div>
)}

    </div>
  );
};

export default BubbleGame;