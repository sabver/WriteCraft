'use client';

import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { BlockLabel } from '@/components/common/BlockLabel';

interface Flashcard3DProps {
  front: string;
  back: {
    userTranslation: string;
    aiRevision: string;
    feedbackSummary: string[];
  };
  onFlip?: (isFlipped: boolean) => void;
}

export function Flashcard3D({ front, back, onFlip }: Flashcard3DProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => {
      const nextState = !prev;
      onFlip?.(nextState);
      return nextState;
    });
  }, [onFlip]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleFlip();
    }
  }, [handleFlip]);

  return (
    <div 
      className="w-full max-w-2xl h-[450px] perspective-1000 cursor-pointer group outline-none"
      onClick={handleFlip}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Flashcard: ${isFlipped ? 'Back' : 'Front'}. Press space to flip.`}
    >
      <motion.div
        className="relative w-full h-full preserve-3d transition-all duration-500"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
      >
        {/* Front Face */}
        <div className="absolute inset-0 backface-hidden bg-white rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col items-center justify-center p-12 text-center overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-primary to-purple-500" />
          <BlockLabel className="mb-8">Source Text</BlockLabel>
          <p className="text-3xl md:text-4xl font-black text-slate-900 leading-tight font-display tracking-tight">
            {front}
          </p>
          <div className="mt-12 flex items-center gap-2 text-slate-400 animate-pulse">
            <span className="text-xs font-bold uppercase tracking-widest">Tap or space to reveal</span>
          </div>
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 backface-hidden bg-white rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col p-10 rotate-y-180 overflow-y-auto">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-primary to-blue-400" />
          
          <div className="space-y-6">
            <section>
              <BlockLabel className="mb-2">Your Translation</BlockLabel>
              <div className="bg-slate-50 rounded-2xl p-4 text-slate-700 font-medium border border-slate-100">
                {back.userTranslation}
              </div>
            </section>

            <section>
              <BlockLabel className="mb-2 text-primary">AI Revision</BlockLabel>
              <div className="bg-primary/5 rounded-2xl p-4 text-slate-900 font-bold border border-primary/10">
                {back.aiRevision}
              </div>
            </section>

            <section>
              <BlockLabel className="mb-2 text-orange-500">Key Feedback</BlockLabel>
              <ul className="space-y-2">
                {back.feedbackSummary.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
