'use client';

import React, { useState, useEffect } from 'react';
import { Flashcard3D } from '@/components/flashcard/Flashcard3D';
import { ArrowLeft, Trophy } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { getDueFlashcards, updateFlashcard } from '@/services/flashcard';
import { Flashcard } from '@/lib/types';
import { cn } from '@/lib/utils';
import { PageWrapper } from '@/components/common/PageWrapper';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';

export default function FlashcardReviewPage() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    async function loadCards() {
      const dueCards = await getDueFlashcards();
      setCards(dueCards);
      setLoading(false);
    }
    loadCards();
  }, []);

  const handleRate = async (rating: number) => {
    const currentCard = cards[currentIndex];
    await updateFlashcard(currentCard.id, rating);
    
    if (currentIndex < cards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
      }, 300);
    } else {
      setCompleted(true);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <PageWrapper>
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between mb-12">
              <div className="h-8 w-48 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-8 w-32 bg-slate-100 rounded-lg animate-pulse" />
            </div>
            <SkeletonCard variant="flashcard" />
          </div>
        </PageWrapper>
      </MainLayout>
    );
  }

  if (completed || cards.length === 0) {
    return (
      <MainLayout>
        <PageWrapper>
          <div className="max-w-xl mx-auto h-[60vh] flex flex-col items-center justify-center text-center space-y-8">
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-24 h-24 bg-green-100 rounded-[2rem] flex items-center justify-center text-green-600"
            >
              <Trophy className="w-12 h-12" />
            </motion.div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2 font-display">All caught up! 🎉</h2>
              <p className="text-slate-500 text-lg font-medium">You&apos;ve reviewed all your due cards for today. Come back tomorrow!</p>
            </div>
            <Button asChild size="lg" className="px-10 py-7 rounded-2xl font-black shadow-xl shadow-primary/30 text-white">
              <Link href="/">
                Back to Dashboard
              </Link>
            </Button>
          </div>
        </PageWrapper>
      </MainLayout>
    );
  }

  const currentCard = cards[currentIndex];

  return (
    <MainLayout>
      <PageWrapper>
        <div className="max-w-4xl mx-auto flex flex-col h-full">
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-slate-400 hover:text-slate-900 transition-colors" aria-label="Back to dashboard">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h2 className="text-xl font-bold text-slate-900">Review Session</h2>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progress</span>
              <span className="text-sm font-black text-primary">{currentIndex + 1} / {cards.length}</span>
            </div>
            <div className="w-48 h-2 bg-slate-100 rounded-full overflow-hidden" role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemin={1} aria-valuemax={cards.length}>
              <motion.div 
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
              />
            </div>
          </div>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center gap-12 min-h-[500px]">
          <Flashcard3D 
            front={currentCard.front} 
            back={currentCard.back} 
            onFlip={setIsFlipped}
          />

          <AnimatePresence mode="wait">
            {isFlipped && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="w-full max-w-2xl"
              >
                <p className="text-center text-slate-400 text-sm font-bold uppercase tracking-widest mb-6">How well did you recall this?</p>
                <div className="grid grid-cols-6 gap-3">
                  {[0, 1, 2, 3, 4, 5].map((rating) => (
                    <button
                      key={rating}
                      type="button"
                      onClick={() => handleRate(rating)}
                      className={cn(
                        "group flex flex-col items-center gap-2 p-2 rounded-2xl transition-all duration-200 hover:-translate-y-1",
                        rating <= 2 ? "hover:bg-red-50" : rating === 3 ? "hover:bg-yellow-50" : "hover:bg-green-50"
                      )}
                      aria-label={`Rate ${rating}`}
                    >
                      <div className={cn(
                        "h-14 w-full bg-white border-2 rounded-xl flex items-center justify-center shadow-sm transition-all",
                        rating <= 2 ? "group-hover:border-red-500 group-hover:text-red-600" : 
                        rating === 3 ? "group-hover:border-yellow-500 group-hover:text-yellow-600" : 
                        "group-hover:border-green-500 group-hover:text-green-600",
                        "border-slate-100 text-slate-400 font-black text-xl"
                      )}>
                        {rating}
                      </div>
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity",
                        rating <= 2 ? "text-red-500" : rating === 3 ? "text-yellow-600" : "text-green-600"
                      )}>
                        {rating === 0 ? 'Forgot' : rating === 3 ? 'Hard' : rating === 5 ? 'Easy' : ''}
                      </span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 flex justify-center gap-8 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
          <span className="flex items-center gap-2">
            <kbd className="bg-slate-100 px-2 py-1 rounded-md text-slate-600 font-mono">1-5</kbd> Rate
          </span>
          <span className="flex items-center gap-2">
            <kbd className="bg-slate-100 px-2 py-1 rounded-md text-slate-600 font-mono">Space</kbd> Flip
          </span>
        </div>
      </div>
    </PageWrapper>
    </MainLayout>
  );
}
