'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { ProgressStepper } from '@/components/common/ProgressStepper';
import { PageWrapper } from '@/components/common/PageWrapper';
import { InterviewContextForm } from '@/components/input/InterviewContextForm';
import { SourceTextForm } from '@/components/input/SourceTextForm';
import { TranslationPanel } from '@/components/input/TranslationPanel';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function InterviewPage() {
  const [step, setStep] = useState(0);
  const [sourceText, setSourceText] = useState('');
  const router = useRouter();

  const handleContextSubmit = () => {
    setStep(1);
  };

  const handleSourceSubmit = (data: { sourceText: string }) => {
    setSourceText(data.sourceText);
    setStep(2);
  };

  const handleTranslationSubmit = () => {
    router.push('/review');
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
            <TranslationPanel 
              sourceText={sourceText}
              aiReference="I believe my greatest strength is my ability to learn quickly and adapt to new technologies."
              onSubmit={handleTranslationSubmit}
            />
          )}
        </div>
        
        <div className="h-20" />
      </PageWrapper>
    </MainLayout>
  );
}
