'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { ProgressStepper } from '@/components/common/ProgressStepper';
import { PageWrapper } from '@/components/common/PageWrapper';
import { DailyContextForm } from '@/components/input/DailyContextForm';
import { SourceTextForm } from '@/components/input/SourceTextForm';
import { TranslationPanel } from '@/components/input/TranslationPanel';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createSession } from '@/services/sessions';
import type { IssueType, IssueTypeDB, SeverityDB, ReviewIssue } from '@/lib/types';

function mapIssueType(t: IssueType): IssueTypeDB {
  if (t === 'word-choice') return 'WORD_CHOICE';
  return t.toUpperCase() as IssueTypeDB;
}

export default function DailyPage() {
  const [step, setStep] = useState(0);
  const [context, setContext] = useState<Record<string, string>>({});
  const [sourceText, setSourceText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const handleContextSubmit = (data: { setting?: string; formality?: string }) => {
    setContext({ setting: data.setting ?? '', formality: data.formality ?? '' });
    setStep(1);
  };

  const handleSourceSubmit = (data: { sourceText: string }) => {
    setSourceText(data.sourceText);
    setStep(2);
  };

  const handleTranslationSubmit = async (userTranslation: string) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: sourceText, translation: userTranslation, scene: 'DAILY', context }),
      });
      if (!res.ok) throw new Error('AI review failed');
      const { data: issues }: { data: ReviewIssue[] } = await res.json();

      const sessionId = await createSession({
        scene: 'DAILY',
        context,
        sourceText,
        userTranslation,
        aiReference: userTranslation,
        issues: issues.map((iss, i) => ({
          type: mapIssueType(iss.type),
          title: iss.title,
          original: iss.original,
          revised: iss.revised,
          reason: iss.reason,
          severity: iss.severity.toUpperCase() as SeverityDB,
          sortOrder: i,
        })),
      });

      sessionStorage.setItem('writecraft:session-draft', JSON.stringify(
        { sessionId, scene: 'DAILY', context, sourceText, userTranslation, issues }
      ));
      router.push('/review');
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = ['Context', 'Source', 'Translate', 'Review', 'Flashcard'];

  return (
    <MainLayout>
      <PageWrapper>
        <div className="flex items-center gap-6">
          <Link 
            href="/"
            className="h-12 w-12 flex items-center justify-center rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
          >
            <ArrowLeft className="w-6 h-6 text-slate-600" />
          </Link>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight font-display">Daily Practice</h2>
            <p className="text-slate-500 text-lg font-medium">
              {step === 0 ? 'Set the context for your daily conversation.' : 
               step === 1 ? 'Record the expression in your native language.' :
               'Translate your daily expression.'}
            </p>
          </div>
        </div>

        <ProgressStepper 
          steps={steps} 
          currentStep={step} 
        />

        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm p-8 md:p-12">
          {step === 0 && <DailyContextForm onNext={handleContextSubmit} />}
          {step === 1 && (
            <SourceTextForm 
              onNext={handleSourceSubmit} 
              placeholder="e.g., 我想在市中心租一个带阳台的公寓。"
              hint="Write the phrase or sentence in your native language that you want to practice."
            />
          )}
          {step === 2 && (
            <>
              <TranslationPanel
                sourceText={sourceText}
                aiReference="I'd like to rent an apartment with a balcony in the city center."
                onSubmit={handleTranslationSubmit}
                disabled={submitting}
              />
              {submitting && (
                <p className="text-center text-sm font-medium text-slate-500 mt-4">Submitting for AI review…</p>
              )}
              {submitError && (
                <div className="flex items-center gap-3 mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-sm font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {submitError}
                </div>
              )}
            </>
          )}
        </div>

        <div className="h-20" />
      </PageWrapper>
    </MainLayout>
  );
}
