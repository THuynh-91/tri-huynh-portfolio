import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const codeSnippets = [
  `const ai = new MachineLearning();\nai.train(data).predict();`,
  `fetch('/api/data')\n  .then(res => res.json())\n  .then(data => render(data));`,
  `const server = express();\nserver.use(middleware);\nserver.listen(3000);`,
  `model = Sequential([\n  Dense(128, activation='relu'),\n  Dropout(0.2),\n  Dense(10, activation='softmax')\n]);`
];

export default function LiveTypingCode() {
  const [currentSnippet, setCurrentSnippet] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const snippet = codeSnippets[currentSnippet];

    if (currentIndex < snippet.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(snippet.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 50);
      return () => clearTimeout(timeout);
    } else {
      // Wait 3 seconds before moving to next snippet
      const timeout = setTimeout(() => {
        setCurrentIndex(0);
        setDisplayedText('');
        setCurrentSnippet((prev) => (prev + 1) % codeSnippets.length);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, currentSnippet]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.4 }}
      className="bg-slate-900 rounded-xl p-6 border border-slate-700 font-mono text-sm"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-red-500"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="ml-2 text-gray-400 text-xs">Live Coding</span>
      </div>
      <pre className="text-primary whitespace-pre-wrap min-h-[80px]">
        {displayedText}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="inline-block w-2 h-4 bg-primary ml-1"
        />
      </pre>
    </motion.div>
  );
}
