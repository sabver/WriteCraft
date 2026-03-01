'use client';

import React, { useState, useCallback } from 'react';
import { useTranslations } from 'next-intl';
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

interface CorrectionItemProps {
  issue: ReviewIssue;
}

function CorrectionItem({ issue }: CorrectionItemProps) {
  const t = useTranslations('flashcard3d');
  const reviewItemT = useTranslations('reviewItem');
  const [isOpen, setIsOpen] = useState(false);

  const toggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  }, []);

  const severityText =
    issue.severity === 'high'
      ? reviewItemT('highPriority')
      : issue.severity === 'medium'
      ? reviewItemT('mediumPriority')
      : reviewItemT('lowPriority');

  return (
    <div className="rounded-2xl border border-app-border overflow-hidden">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={isOpen}
        className="w-full text-left px-4 py-3 flex items-start gap-3 min-h-[44px] hover:bg-app-surface-muted transition-colors"
      >
        <div className="flex-1 space-y-1.5 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-app-text-muted uppercase tracking-widest shrink-0">{t('originalLabel')}</span>
            <span className="text-sm text-app-text-muted font-medium truncate">{issue.original}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-primary uppercase tracking-widest shrink-0">{t('revisedLabel')}</span>
            <span className="text-sm text-app-text font-semibold truncate">{issue.revised}</span>
          </div>
        </div>
        <ChevronDown className={`w-4 h-4 text-app-text-muted shrink-0 mt-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

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
            <div className="px-4 pb-4 pt-1 space-y-2 border-t border-app-border bg-app-surface-muted">
              <p className="text-xs font-black text-app-text uppercase tracking-widest">{issue.title}</p>
              <p className="text-sm text-app-text-muted leading-relaxed">{issue.reason}</p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-app-surface-muted text-app-text-muted uppercase tracking-wide">{issue.type}</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
                    issue.severity === 'high'
                      ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                      : issue.severity === 'medium'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  }`}
                >
                  {severityText}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Flashcard3D({ front, back, sessionId, onFlip }: Flashcard3DProps) {
  const t = useTranslations('flashcard3d');
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = useCallback(() => {
    const nextState = !isFlipped;
    setIsFlipped(nextState);
    onFlip?.(nextState);
  }, [isFlipped, onFlip]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleFlip();
      }
    },
    [handleFlip],
  );

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
      aria-label={t('tapToReveal')}
    >
      <motion.div
        className="relative w-full preserve-3d transition-all duration-500"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        style={{ minHeight: isFlipped ? undefined : '450px' }}
      >
        <div className="absolute inset-0 backface-hidden bg-app-surface rounded-[2.5rem] shadow-xl border border-app-border flex flex-col items-center justify-center p-12 text-center overflow-hidden min-h-[450px]">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-primary to-purple-500" />
          <BlockLabel className="mb-8">{t('sourceLabel')}</BlockLabel>
          <p className="text-3xl md:text-4xl font-black text-app-text leading-tight font-display tracking-tight">{front}</p>
          <div className="mt-12 flex items-center gap-2 text-app-text-muted animate-pulse">
            <span className="text-xs font-bold uppercase tracking-widest">{t('tapToReveal')}</span>
          </div>
        </div>

        <div className="backface-hidden bg-app-surface rounded-[2.5rem] shadow-xl border border-app-border flex flex-col p-10 rotate-y-180 min-h-[450px]">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-primary to-blue-400 rounded-t-[2.5rem]" />

          <div className="space-y-6 mt-2">
            <section>
              <BlockLabel className="mb-2">{t('translationLabel')}</BlockLabel>
              <div className="bg-app-surface-muted rounded-2xl p-4 text-app-text font-medium border border-app-border">{back.userTranslation}</div>
            </section>

            <section>
              <BlockLabel className="mb-3 text-primary">{t('aiRevisionLabel')}</BlockLabel>

              {back.issues.length === 0 ? (
                <p className="text-sm text-app-text-muted font-medium italic px-1">{t('noCorrections')}</p>
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
                      {t('moreCorrections', { count: back.issues.length - 5 })}
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
