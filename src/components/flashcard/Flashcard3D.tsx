'use client';

// spec: 003-flashcard-ai-revision-display  plan §7
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { BlockLabel } from '@/components/common/BlockLabel';
import type { ReviewIssue } from '@/lib/types';

interface Flashcard3DProps {
  front: string;
  back: {
    userTranslation: string;
    issues: ReviewIssue[];
  };
  sessionId?: string;
  onFlip?: (isFlipped: boolean) => void;
}

// ─── CorrectionItem ──────────────────────────────────────────────────────────

interface CorrectionItemProps {
  issue: ReviewIssue;
}

function CorrectionItem({ issue }: CorrectionItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // prevent card flip
    setIsOpen((prev) => !prev);
  }, []);

  return (
    <div className="rounded-2xl border border-slate-100 overflow-hidden">
      {/* Collapsed header — always visible */}
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        className="w-full text-left px-4 py-3 flex items-start gap-3 min-h-[44px] hover:bg-slate-50 transition-colors"
      >
        <div className="flex-1 space-y-1.5 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">Original</span>
            <span className="text-sm text-slate-500 font-medium truncate">{issue.original}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest shrink-0">Revised</span>
            <span className="text-sm text-slate-900 font-semibold truncate">{issue.revised}</span>
          </div>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 mt-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Expanded detail — animated */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 space-y-2 border-t border-slate-100 bg-slate-50">
              <p className="text-xs font-black text-slate-700 uppercase tracking-widest">{issue.title}</p>
              <p className="text-sm text-slate-600 leading-relaxed">{issue.reason}</p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 uppercase tracking-wide">
                  {issue.type}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                  issue.severity === 'high'
                    ? 'bg-red-100 text-red-600'
                    : issue.severity === 'medium'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-green-100 text-green-700'
                }`}>
                  {issue.severity}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Flashcard3D ─────────────────────────────────────────────────────────────

export function Flashcard3D({ front, back, sessionId, onFlip }: Flashcard3DProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = useCallback(() => {
    const nextState = !isFlipped;
    setIsFlipped(nextState);
    onFlip?.(nextState);
  }, [isFlipped, onFlip]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      handleFlip();
    }
  }, [handleFlip]);

  const visibleIssues = back.issues.slice(0, 5);
  const hasMore = back.issues.length > 5;
  const moreHref = sessionId ? `/history/${sessionId}` : '#';

  return (
    <div
      className="w-full max-w-2xl perspective-1000 cursor-pointer group outline-none"
      onClick={handleFlip}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Flashcard: ${isFlipped ? 'Back' : 'Front'}. Press space to flip.`}
    >
      <motion.div
        className="relative w-full preserve-3d transition-all duration-500"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        style={{ minHeight: isFlipped ? undefined : '450px' }}
      >
        {/* Front Face */}
        <div className="absolute inset-0 backface-hidden bg-white rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col items-center justify-center p-12 text-center overflow-hidden min-h-[450px]">
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
        <div className="backface-hidden bg-white rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col p-10 rotate-y-180 min-h-[450px]">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-primary to-blue-400 rounded-t-[2.5rem]" />

          <div className="space-y-6 mt-2">
            {/* Your Translation */}
            <section>
              <BlockLabel className="mb-2">Your Translation</BlockLabel>
              <div className="bg-slate-50 rounded-2xl p-4 text-slate-700 font-medium border border-slate-100">
                {back.userTranslation}
              </div>
            </section>

            {/* AI Revision — multi-correction accordion */}
            <section>
              <BlockLabel className="mb-3 text-primary">AI Revision</BlockLabel>

              {back.issues.length === 0 ? (
                <p className="text-sm text-slate-400 font-medium italic px-1">No corrections needed</p>
              ) : (
                <div className="space-y-2">
                  {visibleIssues.map((issue) => (
                    <CorrectionItem key={issue.id} issue={issue} />
                  ))}

                  {hasMore && (
                    <a
                      href={moreHref}
                      onClick={(e) => e.stopPropagation()}
                      className="block text-center text-xs font-bold text-primary hover:underline pt-1"
                    >
                      +{back.issues.length - 5} more — view all corrections
                    </a>
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
