import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const codeSnippets = [
  'function quantumSync() {',
  '  const neuralNet = await initNetwork();',
  '  processDataStream(0x4F2A);',
  '  return matrix.compile();',
  '}',
  '',
  'class HolographicInterface {',
  '  constructor() {',
  '    this.particles = [];',
  '    this.renderFrame();',
  '  }',
  '}',
  '',
  'const flux = calculateQuantum();',
  'await deployMatrix(flux);',
  'console.log("System Active");',
  '',
  'for (let i = 0; i < 1000; i++) {',
  '  particles[i].update();',
  '}',
];

export function CodeAnimation() {
  const [lines, setLines] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % codeSnippets.length);
      setLines((prev) => {
        const newLines = [...prev, codeSnippets[currentIndex]];
        // Keep only last 6 lines
        return newLines.slice(-6);
      });
    }, 800);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <div className="w-80 h-48 rounded-lg border-2 border-gray-400/40 bg-gray-100/40 backdrop-blur-sm p-4 overflow-hidden relative">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-400/30">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-gray-400" />
          <div className="w-3 h-3 rounded-full bg-gray-400" />
          <div className="w-3 h-3 rounded-full bg-gray-400" />
        </div>
        <span className="text-xs text-gray-600 font-mono">neural_core.tsx</span>
      </div>

      {/* Code lines */}
      <div className="font-mono text-sm space-y-1">
        <AnimatePresence initial={false}>
          {lines.map((line, index) => (
            <motion.div
              key={`${index}-${line}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-start gap-2"
            >
              <span className="text-gray-400 select-none min-w-[20px]">
                {index + 1}
              </span>
              <span className="text-gray-700">
                {line || ' '}
              </span>
              {index === lines.length - 1 && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                  className="inline-block w-2 h-4 bg-gray-600 ml-1"
                />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Subtle scan line */}
      <motion.div
        className="absolute inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-gray-400/30 to-transparent pointer-events-none"
        animate={{ top: ['0%', '100%'] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
      />
    </div>
  );
}
