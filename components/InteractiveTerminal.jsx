import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InteractiveTerminal({ isOpen, onClose }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', text: 'Welcome to Tri\'s Portfolio Terminal!' },
    { type: 'system', text: 'Type "help" for available commands.' },
  ]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);
  const historyRef = useRef(null);

  const commands = {
    help: {
      description: 'Show available commands',
      action: () => {
        const cmdList = Object.entries(commands)
          .filter(([cmd]) => !['secret', 'matrix', 'coffee'].includes(cmd))
          .map(([cmd, { description }]) => `  ${cmd.padEnd(10)} - ${description}`);
        return [
          { type: 'output', text: 'Available commands:' },
          { type: 'output', text: '' },
          ...cmdList.map(text => ({ type: 'output', text })),
        ];
      }
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
        { type: 'output', text: '1. AI Wordle Duel (multiple game modes, AI opponents)' },
        { type: 'output', text: '2. Rock Paper Scissor Mind Game (1000+ visitors)' },
        { type: 'output', text: '3. Spotify Recommendation App' },
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
        window.open('/Resume_Tri_Huynh.pdf', '_blank');
        return [{ type: 'output', text: 'Opening resume...' }];
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
      description: 'Who am I?',
      action: () => [
        { type: 'output', text: 'tri-huynh' },
        { type: 'output', text: 'CS Student @ Northeastern' },
        { type: 'output', text: 'Seeking Summer/Fall 2026 opportunities' },
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
        { type: 'output', text: 'You found a secret!' },
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
        { type: 'output', text: 'Here\'s your coffee!' },
      ]
    },
    github: {
      description: 'Open GitHub profile',
      action: () => {
        window.open('https://github.com/THuynh-91', '_blank');
        return [{ type: 'output', text: 'Opening GitHub profile...' }];
      }
    },
    linkedin: {
      description: 'Open LinkedIn',
      action: () => {
        window.open('https://www.linkedin.com/in/tri-huynh-81735326a', '_blank');
        return [{ type: 'output', text: 'Opening LinkedIn...' }];
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

    // Add to command history
    setCommandHistory(prev => [...prev, trimmedInput]);
    setHistoryIndex(-1);

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
    setSuggestions([]);
  };

  const handleKeyDown = (e) => {
    // Tab completion
    if (e.key === 'Tab') {
      e.preventDefault();
      const matches = Object.keys(commands).filter(cmd => cmd.startsWith(input.toLowerCase()));
      if (matches.length === 1) {
        setInput(matches[0]);
        setSuggestions([]);
      } else if (matches.length > 1) {
        setSuggestions(matches);
      }
    }
    // Up arrow - previous command
    else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    }
    // Down arrow - next command
    else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setInput('');
        } else {
          setHistoryIndex(newIndex);
          setInput(commandHistory[newIndex]);
        }
      }
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    // Show suggestions as user types
    if (value) {
      const matches = Object.keys(commands).filter(cmd => cmd.startsWith(value.toLowerCase()));
      setSuggestions(matches.slice(0, 5));
    } else {
      setSuggestions([]);
    }
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
              X
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
          <form onSubmit={handleSubmit} className="bg-slate-800 px-4 py-3 border-t border-slate-700">
            <div className="flex items-center gap-2">
              <span className="text-green-400 font-mono">$</span>
              <div className="flex-1 relative">
                {/* Inline suggestion */}
                {suggestions.length === 1 && input && (
                  <div className="absolute inset-0 font-mono text-gray-600 pointer-events-none">
                    {suggestions[0]}
                  </div>
                )}
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="w-full bg-transparent text-white font-mono outline-none relative z-10"
                  placeholder="Type a command..."
                  autoFocus
                />
              </div>
            </div>
            {/* Multiple suggestions below */}
            {suggestions.length > 1 && (
              <div className="mt-2 text-xs text-gray-400">
                Suggestions: {suggestions.join(', ')}
              </div>
            )}
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
