import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function InteractiveMiniGame() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameActive, setGameActive] = useState(false);
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    let timer;
    if (gameActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setGameActive(false);
    }
    return () => clearInterval(timer);
  }, [gameActive, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setGameActive(true);
    moveButton();
  };

  const moveButton = () => {
    const newX = Math.random() * 80 + 10; // 10-90%
    const newY = Math.random() * 70 + 10; // 10-80%
    setPosition({ x: newX, y: newY });
  };

  const handleClick = () => {
    if (!gameActive) return;
    setScore(prev => prev + 1);
    setClicked(true);
    setTimeout(() => setClicked(false), 200);
    moveButton();
  };

  return (
    <section id="minigame" className="section-padding bg-slate-800">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Quick <span className="text-gradient">Reaction</span> Game
          </h2>
          <p className="text-gray-400 text-center mb-8">
            Click the moving button as many times as you can in 30 seconds!
          </p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-primary/20"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          {/* Game Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-center">
              <p className="text-gray-400 text-sm mb-1">Score</p>
              <p className="text-4xl font-bold text-primary">{score}</p>
            </div>
            <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 text-center">
              <p className="text-gray-400 text-sm mb-1">Time Left</p>
              <p className="text-4xl font-bold text-accent">{timeLeft}s</p>
            </div>
          </div>

          {/* Game Area */}
          <div className="relative bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-700 overflow-hidden" style={{ height: '400px' }}>
            {!gameActive && timeLeft === 30 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={startGame}
                  className="btn-primary text-lg px-8 py-4"
                >
                  Start Game
                </button>
              </div>
            )}

            {!gameActive && timeLeft === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <h3 className="text-3xl font-bold text-white mb-2">Game Over!</h3>
                <p className="text-xl text-gray-400 mb-6">Final Score: <span className="text-primary font-bold">{score}</span></p>
                <button
                  onClick={startGame}
                  className="btn-primary"
                >
                  Play Again
                </button>
              </div>
            )}

            {gameActive && (
              <motion.button
                onClick={handleClick}
                className="absolute w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full shadow-lg hover:shadow-2xl transition-all flex items-center justify-center"
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                animate={clicked ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.2 }}
              >
                <span className="text-2xl font-bold text-white">+</span>
              </motion.button>
            )}
          </div>

          {/* High Score Tracker */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Can you beat your high score? The average player gets 15-20 clicks!
            </p>
          </div>
        </motion.div>

        {/* Alternative Game: Color Memory */}
        <ColorMemoryGame />
      </div>
    </section>
  );
}

function ColorMemoryGame() {
  const [sequence, setSequence] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const colors = [
    { id: 0, color: 'bg-red-500', name: 'Red' },
    { id: 1, color: 'bg-blue-500', name: 'Blue' },
    { id: 2, color: 'bg-green-500', name: 'Green' },
    { id: 3, color: 'bg-yellow-500', name: 'Yellow' },
  ];

  const startGame = () => {
    setSequence([]);
    setUserSequence([]);
    setScore(0);
    setGameOver(false);
    setGameStarted(true);
    nextRound([]);
  };

  const nextRound = (currentSequence) => {
    const newColor = Math.floor(Math.random() * 4);
    const newSequence = [...currentSequence, newColor];
    setSequence(newSequence);
    setUserSequence([]);
    playSequence(newSequence);
  };

  const playSequence = async (seq) => {
    setIsPlaying(true);
    for (let i = 0; i < seq.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 600));
      const button = document.getElementById(`color-${seq[i]}`);
      if (button) {
        button.classList.add('brightness-150');
        setTimeout(() => button.classList.remove('brightness-150'), 400);
      }
    }
    setIsPlaying(false);
  };

  const handleColorClick = (colorId) => {
    if (isPlaying || !gameStarted || gameOver) return;

    const newUserSequence = [...userSequence, colorId];
    setUserSequence(newUserSequence);

    // Check if correct
    if (colorId !== sequence[newUserSequence.length - 1]) {
      setGameOver(true);
      setGameStarted(false);
      return;
    }

    // Check if sequence complete
    if (newUserSequence.length === sequence.length) {
      setScore(sequence.length);
      setTimeout(() => nextRound(sequence), 1000);
    }
  };

  return (
    <motion.div
      className="mt-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 border border-accent/20"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4 }}
    >
      <h3 className="text-2xl font-bold text-center mb-4 text-white">
        Memory <span className="text-gradient">Challenge</span>
      </h3>
      <p className="text-gray-400 text-center mb-6 text-sm">
        Watch the pattern and repeat it!
      </p>

      <div className="text-center mb-6">
        <div className="inline-block bg-slate-800/50 px-6 py-3 rounded-xl border border-slate-700">
          <p className="text-gray-400 text-sm">Level</p>
          <p className="text-3xl font-bold text-accent">{score}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto mb-6">
        {colors.map(({ id, color, name }) => (
          <button
            key={id}
            id={`color-${id}`}
            onClick={() => handleColorClick(id)}
            disabled={isPlaying || !gameStarted || gameOver}
            className={`${color} h-24 rounded-xl transition-all duration-200 ${
              isPlaying || !gameStarted || gameOver ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'
            }`}
            title={name}
          />
        ))}
      </div>

      <div className="text-center">
        {!gameStarted && !gameOver && (
          <button onClick={startGame} className="btn-secondary">
            Start Memory Game
          </button>
        )}
        {gameOver && (
          <div>
            <p className="text-white text-lg mb-4">Game Over! You reached level {score}</p>
            <button onClick={startGame} className="btn-secondary">
              Try Again
            </button>
          </div>
        )}
        {isPlaying && (
          <p className="text-gray-400 text-sm">Watch the pattern...</p>
        )}
        {gameStarted && !isPlaying && !gameOver && (
          <p className="text-gray-400 text-sm">Your turn! Repeat the pattern</p>
        )}
      </div>
    </motion.div>
  );
}
