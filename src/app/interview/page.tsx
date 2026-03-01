'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { ProgressStepper } from '@/components/common/ProgressStepper';
import { PageWrapper } from '@/components/common/PageWrapper';
import { InterviewContextForm } from '@/components/input/InterviewContextForm';
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

export default function InterviewPage() {
  const [step, setStep] = useState(0);
  const [context, setContext] = useState<Record<string, string>>({});
  const [sourceText, setSourceText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const router = useRouter();

  const handleContextSubmit = (data: { jobDescription: string; companyBackground: string; questionType: string }) => {
    setContext(data);
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
        body: JSON.stringify({ source: sourceText, translation: userTranslation, scene: 'INTERVIEW', context }),
      });
      if (!res.ok) throw new Error('AI review failed');
      const { data: issues }: { data: ReviewIssue[] } = await res.json();

      const sessionId = await createSession({
        scene: 'INTERVIEW',
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
        { sessionId, scene: 'INTERVIEW', context, sourceText, userTranslation, issues }
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
            <h2 className="text-3xl font-black text-slate-900 tracking-tight font-display">Job Interview Practice</h2>
            <p className="text-slate-500 text-lg font-medium">
              {step === 0 ? 'Set the context for your mock interview session.' : 
               step === 1 ? 'Record your answer in your native language.' :
               'Write your professional English translation.'}
            </p>
          </div>
        </div>

        <ProgressStepper 
          steps={steps} 
          currentStep={step} 
        />

        <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm p-8 md:p-12">
          {step === 0 && <InterviewContextForm onNext={handleContextSubmit} />}
          {step === 1 && (
            <SourceTextForm 
              onNext={handleSourceSubmit} 
              placeholder="e.g., 我认为我最大的优势是我的学习能力和对新技术的适应能力。"
              hint="Write your answer to the interview question in your native language first."
            />
          )}
          {step === 2 && (
            <>
              <TranslationPanel
                sourceText={sourceText}
                aiReference="I believe my greatest strength is my ability to learn quickly and adapt to new technologies."
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
