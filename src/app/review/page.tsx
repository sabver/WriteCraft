'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, Sparkles, ArrowRight, AlertCircle, BookOpen } from 'lucide-react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { ReviewItem } from '@/components/review/ReviewItem';
import { ProgressStepper } from '@/components/common/ProgressStepper';
import { PageWrapper } from '@/components/common/PageWrapper';
import { ActionBar } from '@/components/common/ActionBar';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import type { ReviewIssue } from '@/lib/types';

export default function ReviewPage() {
  const [issues, setIssues] = useState<ReviewIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [noSession, setNoSession] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations('review');
  const stepperT = useTranslations('stepper');

  useEffect(() => {
    const raw = sessionStorage.getItem('writecraft:session-draft');
    if (!raw) {
      setNoSession(true);
      setLoading(false);
      return;
    }
    try {
      const draft = JSON.parse(raw) as { issues: ReviewIssue[] };
      setIssues(draft.issues);
    } catch {
      setError(t('errorTitle'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  const steps = [stepperT('context'), stepperT('source'), stepperT('translate'), stepperT('review'), stepperT('flashcard')];

  if (loading) {
    return (
      <MainLayout>
        <PageWrapper>
          <ProgressStepper steps={steps} currentStep={3} />
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} variant="detail" />
            ))}
          </div>
        </PageWrapper>
      </MainLayout>
    );
  }

  if (noSession) {
    return (
      <MainLayout>
        <PageWrapper className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400 mb-6">
            <BookOpen className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">{t('emptyTitle')}</h2>
          <p className="text-slate-500 font-medium mb-8 max-w-md">{t('emptyBody')}</p>
          <Link href="/interview" className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all">
            {t('startPracticeBtn')}
          </Link>
        </PageWrapper>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <PageWrapper className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 mb-6">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">{t('errorTitle')}</h2>
          <p className="text-slate-500 font-medium mb-8 max-w-md">{error}</p>
          <Link href="/interview" className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all">
            {t('startPracticeBtn')}
          </Link>
        </PageWrapper>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageWrapper>
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-1 font-display">{t('pageTitle')}</h2>
            <p className="text-slate-500 text-lg font-medium">{t('pageSubtitle')}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">{t('aiBadge')}</div>
              <div className="w-8 h-8 rounded-full border-2 border-white bg-green-100 flex items-center justify-center text-[10px] font-bold text-green-600">{t('youBadge')}</div>
            </div>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t('analysisComplete')}</span>
          </div>
        </header>

        <ProgressStepper steps={steps} currentStep={3} />

        <div className="border-b border-slate-200">
          <nav className="flex gap-8">
            <button className="border-b-2 border-primary text-primary py-4 px-1 inline-flex items-center gap-2 text-sm font-bold">
              {t('allIssues')}
              <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full">{issues.length}</span>
            </button>
          </nav>
        </div>

        <div className="flex flex-col gap-6">
          {issues.map((issue) => (
            <ReviewItem key={issue.id} issue={issue} />
          ))}

          {issues.length === 0 && (
            <div className="bg-green-50 border border-green-100 rounded-[2.5rem] p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center text-green-600 mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900">{t('successTitle')}</h3>
                <p className="text-slate-600 font-medium">{t('successBody')}</p>
              </div>
            </div>
          )}
        </div>

        <ActionBar>
          <Link
            href="/flashcard/generate"
            className="w-full md:w-auto shadow-2xl shadow-primary/40 flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-white px-10 py-4 rounded-full text-lg font-black transition-all transform hover:-translate-y-1 active:scale-95"
          >
            <Sparkles className="w-5 h-5" />
            {t('generateFlashcardsBtn')}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </ActionBar>

        <div className="h-24" />
      </PageWrapper>
    </MainLayout>
  );
}
