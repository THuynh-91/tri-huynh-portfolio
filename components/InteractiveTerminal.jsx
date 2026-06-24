import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import projectsData from '../data/projects.json';

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
  const router = useRouter();
  const basePath = router.basePath || '';

  const commands = {
    help: {
      description: 'Show available commands',
      action: () => {
        const cmdList = Object.entries(commands)
          .filter(([cmd]) => !['matrix', 'sudo'].includes(cmd))
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
        { type: 'output', text: 'CS Student @ Northeastern University (AI concentration)' },
        { type: 'output', text: 'Just wrapped an AI Engineer Co-op @ Biogen' },
        { type: 'output', text: 'Built production AI agents with the Claude SDK, Azure & Databricks' },
        { type: 'output', text: 'Based in Boston, MA' },
      ]
    },
    ai: {
      description: 'AI tools & agentic stack',
      action: () => [
        { type: 'output', text: 'Agents:   Claude SDK, Claude Code, Codex, agentic workflows' },
        { type: 'output', text: 'Copilots: GitHub Copilot, Microsoft Copilot Studio' },
        { type: 'output', text: 'RAG:      ChromaDB, Sentence-Transformers, FAISS, LangSmith' },
        { type: 'output', text: 'Local:    Ollama (Qwen 7B)' },
        { type: 'output', text: 'ML:       PyTorch, TensorFlow, scikit-learn' },
      ]
    },
    skills: {
      description: 'View technical skills',
      action: () => [
        { type: 'output', text: 'AI/Agents:  Claude SDK, Claude Code, Codex, Copilot Studio' },
        { type: 'output', text: 'Languages:  Python, TypeScript, Java, SQL' },
        { type: 'output', text: 'Frameworks: FastAPI, Next.js, React, Streamlit' },
        { type: 'output', text: 'Data/Cloud: Azure, Databricks, Snowflake, Docker' },
        { type: 'output', text: '(tip: try "ai" for the full agentic stack)' },
      ]
    },
    projects: {
      description: 'List projects',
      action: () => [
        { type: 'output', text: `${projectsData.length} projects designed & shipped:` },
        { type: 'output', text: '' },
        ...projectsData.map((p, i) => ({
          type: 'output',
          text: `${String(i + 1).padStart(2)}. ${p.title} (${p.tagline})`,
        })),
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
        window.open(`${basePath}/Resume_Tri_Huynh.pdf`, '_blank');
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
        { type: 'output', text: 'CS Student @ Northeastern · AI concentration' },
        { type: 'output', text: 'Open to AI / ML roles & collaborations' },
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
    easteregg: {
      description: 'Reveal the hidden stuff',
      action: () => [
        { type: 'output', text: '🥚 EASTER EGG HUNT 🥚' },
        { type: 'output', text: '' },
        { type: 'output', text: '1. A tiny 🕵️  is peeking from the left edge, click them' },
        { type: 'output', text: '' },
        { type: 'output', text: '2. Secret terminal commands: matrix, sudo' },
        { type: 'output', text: '' },
        { type: 'output', text: 'Happy hunting! 🎉' },
      ]
    },
    sudo: {
      description: 'Run with superuser privileges',
      action: () => {
        window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
        return [
          { type: 'output', text: '[sudo] password for tri-huynh: ****' },
          { type: 'output', text: 'Access granted! Opening privileged content...' },
          { type: 'output', text: 'You should know better than to trust a sudo prompt 😏' },
        ];
      }
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
        { type: 'output', text: 'Shipped production AI agents @ Biogen (Claude SDK, Azure, Databricks)' },
        { type: 'output', text: 'Builds agentic + RAG systems end to end, model → backend → UI' },
        { type: 'output', text: 'Full-stack: React, Next.js, FastAPI, Docker' },
        { type: 'output', text: '1000+ users on a deployed ML application' },
        { type: 'output', text: 'Fast with AI tooling: Claude Code, Codex, Copilot Studio' },
        { type: 'output', text: '' },
        { type: 'output', text: 'Let\'s talk → triqhuynh91@gmail.com' },
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
