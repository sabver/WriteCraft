'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { ProgressStepper } from '@/components/common/ProgressStepper';
import { PageWrapper } from '@/components/common/PageWrapper';
import { DailyContextForm } from '@/components/input/DailyContextForm';
import { SourceTextForm } from '@/components/input/SourceTextForm';
import { TranslationPanel } from '@/components/input/TranslationPanel';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DailyPage() {
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
            <TranslationPanel 
              sourceText={sourceText}
              aiReference="I'd like to rent an apartment with a balcony in the city center."
              onSubmit={handleTranslationSubmit}
            />
          )}
        </div>
        
        <div className="h-20" />
      </PageWrapper>
    </MainLayout>
  );
}
