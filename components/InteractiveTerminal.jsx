import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InteractiveTerminal({ isOpen, onClose }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: 'Welcome to Tri\'s Portfolio Terminal!' },
    { type: 'system', text: 'Type "help" for available commands.' },
  ]);
  const inputRef = useRef(null);
  const historyRef = useRef(null);

  const commands = {
    help: {
      description: 'Show available commands',
      action: () => [
        { type: 'output', text: 'Available commands:' },
        { type: 'output', text: '  about, whoami, skills, projects, contact' },
        { type: 'output', text: '  quote, joke, easteregg' },
        { type: 'output', text: '  resume, github, hire' },
        { type: 'output', text: '  clear, exit, sudo' },
      ]
    },
    about: {
      description: 'Learn about Tri',
      action: () => [
        { type: 'output', text: 'Tri Huynh' },
        { type: 'output', text: 'CS Student @ Northeastern University' },
        { type: 'output', text: 'Specializing in Artificial Intelligence' },
        { type: 'output', text: 'AWS Certified Cloud Practitioner' },
        { type: 'output', text: 'Based in Boston, MA' },
      ]
    },
    skills: {
      description: 'View technical skills',
      action: () => [
        { type: 'output', text: 'Languages:  Python, Java, JavaScript, TypeScript' },
        { type: 'output', text: 'Frameworks: FastAPI, Next.js, React, Flask' },
        { type: 'output', text: 'ML/AI:      TensorFlow, Keras, scikit-learn' },
        { type: 'output', text: 'Cloud:      AWS (Certified), Docker, Vercel' },
      ]
    },
    projects: {
      description: 'List featured projects',
      action: () => [
        { type: 'output', text: '1. Rock Paper Scissor Mind Game (1000+ visitors)' },
        { type: 'output', text: '2. Spotify Recommendation App' },
        { type: 'output', text: '3. AAOC Planner' },
        { type: 'output', text: '4. FreeCodeCamp Daily Challenges' },
      ]
    },
    contact: {
      description: 'Get contact information',
      action: () => [
        { type: 'output', text: 'Email:    triqhuynh91@gmail.com' },
        { type: 'output', text: 'LinkedIn: linkedin.com/in/tri-huynh-81735326a' },
        { type: 'output', text: 'GitHub:   github.com/THuynh-91' },
      ]
    },
    resume: {
      description: 'Download resume',
      action: () => {
        window.open('/resume.pdf', '_blank');
        return [{ type: 'output', text: '📄 Opening resume in new tab...' }];
      }
    },
    joke: {
      description: 'Get a programming joke',
      action: () => {
        const jokes = [
          'Why do programmers prefer dark mode? Because light attracts bugs! 🐛',
          'How many programmers does it take to change a light bulb? None, that\'s a hardware problem! 💡',
          'Why do Java developers wear glasses? Because they don\'t C#! 👓',
          'A SQL query walks into a bar, walks up to two tables and asks... "Can I JOIN you?" 🍺',
          'Why did the programmer quit his job? Because he didn\'t get arrays! 📊',
        ];
        return [{ type: 'output', text: jokes[Math.floor(Math.random() * jokes.length)] }];
      }
    },
    clear: {
      description: 'Clear terminal',
      action: () => 'CLEAR'
    },
    exit: {
      description: 'Close terminal',
      action: () => {
        onClose();
        return [];
      }
    },
    whoami: {
      description: 'Display current user info',
      action: () => [
        { type: 'output', text: 'tri-huynh' },
        { type: 'output', text: 'CS Student @ Northeastern (AI Concentration)' },
        { type: 'output', text: 'Available for Co-op/Internship' },
      ]
    },
    quote: {
      description: 'Random coding quote',
      action: () => {
        const quotes = [
          '"Code is like humor. When you have to explain it, it\'s bad." - Cory House',
          '"First, solve the problem. Then, write the code." - John Johnson',
          '"Experience is the name everyone gives to their mistakes." - Oscar Wilde',
          '"Knowledge is power." - Francis Bacon',
          '"Sometimes it pays to stay in bed on Monday, rather than spending the rest of the week debugging Monday\'s code." - Dan Salomon',
          '"The best error message is the one that never shows up." - Thomas Fuchs',
          '"Simplicity is the soul of efficiency." - Austin Freeman',
          '"Before software can be reusable it first has to be usable." - Ralph Johnson',
        ];
        return [{ type: 'output', text: quotes[Math.floor(Math.random() * quotes.length)] }];
      }
    },
    easteregg: {
      description: 'Discover hidden features',
      action: () => [
        { type: 'output', text: 'Try the Konami Code: ↑ ↑ ↓ ↓ ← → ← → B A' },
        { type: 'output', text: '(Use arrow keys, then B and A keys)' },
      ]
    },
    matrix: {
      description: 'Enter the Matrix',
      action: () => {
        const chars = ['0', '1'];
        const lines = [];
        for (let i = 0; i < 10; i++) {
          let line = '';
          for (let j = 0; j < 50; j++) {
            line += chars[Math.floor(Math.random() * 2)];
          }
          lines.push({ type: 'output', text: line });
        }
        return [
          { type: 'output', text: 'Welcome to the Matrix...' },
          ...lines,
          { type: 'output', text: 'Wake up, Neo...' },
        ];
      }
    },
    secret: {
      description: 'Hidden command',
      action: () => [
        { type: 'output', text: 'You found a secret! 🎉' },
        { type: 'output', text: 'Here are all hidden commands:' },
        { type: 'output', text: '  matrix  - Enter the Matrix' },
        { type: 'output', text: '  secret  - This command' },
        { type: 'output', text: '  coffee  - Get some virtual coffee' },
      ]
    },
    coffee: {
      description: 'Get virtual coffee',
      action: () => [
        { type: 'output', text: '      )  (' },
        { type: 'output', text: '     (   ) )' },
        { type: 'output', text: '      ) ( (' },
        { type: 'output', text: '    _______)_' },
        { type: 'output', text: ' .-\'---------|' },
        { type: 'output', text: '( C|/\\/\\/\\/\\/|' },
        { type: 'output', text: ' \'-./\\/\\/\\/\\/|' },
        { type: 'output', text: '   \'_________\'' },
        { type: 'output', text: '    \'-------\'' },
        { type: 'output', text: '' },
        { type: 'output', text: 'Here\'s your coffee! ☕' },
      ]
    },
    github: {
      description: 'Open GitHub profile',
      action: () => {
        window.open('https://github.com/THuynh-91', '_blank');
        return [{ type: 'output', text: 'Opening GitHub profile...' }];
      }
    },
    hire: {
      description: 'Why you should hire Tri',
      action: () => [
        { type: 'output', text: 'Strong AI/ML foundation with production projects' },
        { type: 'output', text: 'AWS Certified Cloud Practitioner' },
        { type: 'output', text: 'Full-stack: React, Next.js, FastAPI, Docker' },
        { type: 'output', text: '1000+ users on deployed ML application' },
        { type: 'output', text: 'Contact: triqhuynh91@gmail.com' },
      ]
    },
    sudo: {
      description: 'Try it and see',
      action: () => [
        { type: 'error', text: 'Permission denied' },
        { type: 'output', text: 'tri is not in the sudoers file.' },
      ]
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedInput = input.trim();

    if (!trimmedInput) return;

    const newHistory = [...history, { type: 'input', text: `$ ${input}` }];

    // Parse command and arguments
    const parts = trimmedInput.split(' ');
    const command = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (commands[command]) {
      const result = commands[command].action(args);
      if (result === 'CLEAR') {
        setHistory([]);
      } else {
        setHistory([...newHistory, ...result]);
      }
    } else {
      setHistory([...newHistory, { type: 'error', text: `Command not found: ${command}. Type "help" for available commands.` }]);
    }

    setInput('');
  };

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (historyRef.current) {
      historyRef.current.scrollTop = historyRef.current.scrollHeight;
    }
  }, [history]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-slate-900 rounded-lg shadow-2xl border border-slate-700 max-w-3xl w-full max-h-[600px] flex flex-col overflow-hidden"
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Terminal Header */}
          <div className="bg-slate-800 px-4 py-3 flex items-center justify-between border-b border-slate-700">
            <div className="flex items-center gap-2">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer" onClick={onClose}></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="ml-4 text-gray-400 text-sm font-mono">tri@portfolio:~$</span>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white">
              ✕
            </button>
          </div>

          {/* Terminal Body */}
          <div ref={historyRef} className="flex-1 p-4 overflow-y-auto font-mono text-sm space-y-0.5">
            {history.map((item, index) => (
              <div key={index} className={`${
                item.type === 'input' ? 'text-green-400 font-semibold' :
                item.type === 'error' ? 'text-red-400' :
                item.type === 'system' ? 'text-cyan-400' :
                'text-gray-300'
              }`}>
                {item.text}
              </div>
            ))}
          </div>

          {/* Terminal Input */}
          <form onSubmit={handleSubmit} className="bg-slate-800 px-4 py-3 flex items-center gap-2 border-t border-slate-700">
            <span className="text-green-400 font-mono">$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent text-white font-mono outline-none"
              placeholder="Type a command..."
              autoFocus
            />
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
