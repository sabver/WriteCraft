'use client';

import React, { useState } from 'react';
import { ProgressStepper } from '@/components/common/ProgressStepper';
import { ArrowRight, Check, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { saveFlashcards } from '@/services/flashcard';
import { PageWrapper } from '@/components/common/PageWrapper';
import { BlockLabel } from '@/components/common/BlockLabel';
import { ActionBar } from '@/components/common/ActionBar';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';

export default function FlashcardGeneratePage() {
  const [mode, setMode] = useState<'paragraph' | 'sentence'>('paragraph');
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    // Mock saving
    await saveFlashcards([
      {
        sessionId: '1',
        front: "The new skyscraper is very big in the city center.",
        back: {
          userTranslation: "The new skyscraper is very big in the city center.",
          aiRevision: "The new skyscraper is enormous in the city center.",
          feedbackSummary: ["Use 'enormous' for better precision.", "Avoid 'very big' in professional contexts."]
        },
        scene: 'interview',
        context: { role: 'Backend Engineer' },
      }
    ]);
    setSaved(true);
  };

  return (
    <MainLayout>
      <PageWrapper>
        <div className="max-w-4xl mx-auto space-y-10 pb-24">
          <header>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-1 font-display">Generate Flashcards</h2>
            <p className="text-slate-500 text-lg font-medium">Convert your practice session into study material.</p>
          </header>

          <ProgressStepper steps={['Context', 'Source', 'Translate', 'Review', 'Flashcard']} currentStep={4} />

        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden p-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-slate-900">Card Generation Mode</h3>
              <p className="text-sm text-slate-500 font-medium">Choose how you want to split your translation into cards.</p>
            </div>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl self-start md:self-center">
              <button 
                type="button"
                onClick={() => setMode('paragraph')}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                  mode === 'paragraph' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                Paragraph
              </button>
              <button 
                type="button"
                onClick={() => setMode('sentence')}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
                  mode === 'sentence' ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                Sentence
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <BlockLabel>Card Preview</BlockLabel>
            <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 space-y-6">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Front</span>
                <p className="text-xl font-bold text-slate-900">The new skyscraper is very big in the city center.</p>
              </div>
              <div className="h-px bg-slate-100" />
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Back</span>
                <p className="text-slate-600 font-medium italic">Click to expand preview...</p>
              </div>
            </div>
          </div>
        </div>

        <ActionBar>
          {saved ? (
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 px-10 py-7 rounded-2xl font-black shadow-xl shadow-green-600/20 text-white">
              <Link href="/flashcard/review">
                <Layers className="w-5 h-5 mr-2" />
                Go to Review
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
          ) : (
            <Button 
              onClick={handleSave}
              size="lg"
              className="px-10 py-7 rounded-2xl font-black shadow-xl shadow-primary/30 text-white"
            >
              <Check className="w-5 h-5 mr-2" />
              Save Flashcards
            </Button>
          )}
        </ActionBar>
      </div>
    </PageWrapper>
    </MainLayout>
  );
}
