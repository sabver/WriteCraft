'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, Check, Layers, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { ProgressStepper } from '@/components/common/ProgressStepper';
import { cn } from '@/lib/utils';
import { saveFlashcards } from '@/services/flashcard';
import { PageWrapper } from '@/components/common/PageWrapper';
import { BlockLabel } from '@/components/common/BlockLabel';
import { ActionBar } from '@/components/common/ActionBar';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';
import { buildCards } from '@/lib/buildCards';
import type { SessionDraft } from '@/lib/buildCards';

function readDraft(): SessionDraft | null {
  if (typeof window === 'undefined') return null;
  const raw = sessionStorage.getItem('writecraft:session-draft');
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionDraft;
  } catch {
    return null;
  }
}

export default function FlashcardGeneratePage() {
  const [mode, setMode] = useState<'paragraph' | 'sentence'>('paragraph');
  const [saved, setSaved] = useState(false);
  const [draft] = useState<SessionDraft | null>(readDraft);
  const [saveError, setSaveError] = useState<string | null>(null);
  const t = useTranslations('flashcardGenerate');
  const stepperT = useTranslations('stepper');
  const commonT = useTranslations('common');

  const handleSave = async () => {
    if (!draft) return;
    setSaveError(null);
    const cards = buildCards(draft, mode);
    if (cards.length === 0) {
      setSaveError(t('noSessionTitle'));
      return;
    }
    try {
      await saveFlashcards(cards);
      sessionStorage.removeItem('writecraft:session-draft');
      setSaved(true);
    } catch {
      setSaveError(commonT('error'));
    }
  };

  const previewFront = draft
    ? mode === 'paragraph'
      ? draft.sourceText
      : (draft.issues[0]?.original ?? draft.sourceText)
    : t('noSessionTitle');

  const steps = [stepperT('context'), stepperT('source'), stepperT('translate'), stepperT('review'), stepperT('flashcard')];

  return (
    <MainLayout>
      <PageWrapper>
        <div className="max-w-4xl mx-auto space-y-10 pb-24">
          <header>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-1 font-display">{t('pageTitle')}</h2>
            <p className="text-slate-500 text-lg font-medium">{t('pageSubtitle')}</p>
          </header>

          <ProgressStepper steps={steps} currentStep={4} />

          <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden p-10 space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-900">{t('modeTitle')}</h3>
                <p className="text-sm text-slate-500 font-medium">{t('modeSubtitle')}</p>
              </div>
              <div className="flex bg-slate-100 p-1.5 rounded-2xl self-start md:self-center">
                <button
                  type="button"
                  onClick={() => setMode('paragraph')}
                  className={cn(
                    'px-6 py-2.5 rounded-xl text-sm font-bold transition-all',
                    mode === 'paragraph' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700',
                  )}
                >
                  {t('modeParagraph')}
                </button>
                <button
                  type="button"
                  onClick={() => setMode('sentence')}
                  className={cn(
                    'px-6 py-2.5 rounded-xl text-sm font-bold transition-all',
                    mode === 'sentence' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700',
                  )}
                >
                  {t('modeSentence')}
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <BlockLabel>{t('previewTitle')}</BlockLabel>
              <div className="border-2 border-dashed border-slate-200 rounded-3xl p-8 space-y-6">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t('frontLabel')}</span>
                  <p className="text-xl font-bold text-slate-900">{previewFront}</p>
                </div>
                <div className="h-px bg-slate-100" />
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{t('backLabel')}</span>
                  <p className="text-slate-600 font-medium italic">{t('backHint')}</p>
                </div>
              </div>
            </div>

            {saveError && (
              <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-sm font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {saveError}
              </div>
            )}
          </div>

          <ActionBar>
            {saved ? (
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700 px-10 py-7 rounded-2xl font-black shadow-xl shadow-green-600/20 text-white">
                <Link href="/flashcard/review">
                  <Layers className="w-5 h-5 mr-2" />
                  {t('goToReviewBtn')}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            ) : (
              <Button
                onClick={handleSave}
                disabled={!draft}
                size="lg"
                className="px-10 py-7 rounded-2xl font-black shadow-xl shadow-primary/30 text-white"
              >
                <Check className="w-5 h-5 mr-2" />
                {t('saveBtn')}
              </Button>
            )}
          </ActionBar>
        </div>
      </PageWrapper>
    </MainLayout>
  );
}
