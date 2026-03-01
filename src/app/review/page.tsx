'use client';

import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { ReviewItem } from '@/components/review/ReviewItem';
import { ProgressStepper } from '@/components/common/ProgressStepper';
import { PageWrapper } from '@/components/common/PageWrapper';
import { ActionBar } from '@/components/common/ActionBar';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { CheckCircle2, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { ReviewIssue } from '@/lib/types';
import Link from 'next/link';

export default function ReviewPage() {
  const [issues, setIssues] = useState<ReviewIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadReview() {
      try {
        const source = "The new skyscraper is very big in the city center.";
        const translation = "The new skyscraper is very big in the city center.";
        const res = await fetch('/api/review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ source, translation, scene: 'INTERVIEW', context: {} }),
        });
        if (!res.ok) throw new Error('Review request failed');
        const { data } = await res.json();
        setIssues(data);
      } catch {
        setError("Failed to load AI review. Please check your connection and try again.");
      } finally {
        setLoading(false);
      }
    }
    loadReview();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <PageWrapper>
          <ProgressStepper steps={['Context', 'Source', 'Translate', 'Review', 'Flashcard']} currentStep={3} />
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <SkeletonCard key={i} variant="detail" />
            ))}
          </div>
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
          <h2 className="text-2xl font-black text-slate-900 mb-2">Review Failed</h2>
          <p className="text-slate-500 font-medium mb-8 max-w-md">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
          >
            Retry Analysis
          </button>
        </PageWrapper>
      </MainLayout>
    );
  }

  const handleGenerateSingle = (issue: ReviewIssue) => {
    alert(`Flashcard generated for: ${issue.title}`);
  };

  return (
    <MainLayout>
      <PageWrapper>
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-1 font-display">AI Feedback Review</h2>
            <p className="text-slate-500 text-lg font-medium">Review your translation and writing improvements.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-white bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">AI</div>
              <div className="w-8 h-8 rounded-full border-2 border-white bg-green-100 flex items-center justify-center text-[10px] font-bold text-green-600">YOU</div>
            </div>
            <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Analysis Complete</span>
          </div>
        </header>

        <ProgressStepper steps={['Context', 'Source', 'Translate', 'Review', 'Flashcard']} currentStep={3} />

        <div className="border-b border-slate-200">
          <nav className="flex gap-8">
            <button className="border-b-2 border-primary text-primary py-4 px-1 inline-flex items-center gap-2 text-sm font-bold">
              All Issues
              <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full">{issues.length}</span>
            </button>
          </nav>
        </div>

        <div className="flex flex-col gap-6">
          {issues.map((issue) => (
            <ReviewItem 
              key={issue.id} 
              issue={issue} 
              onGenerateFlashcard={handleGenerateSingle} 
            />
          ))}

          {issues.length === 0 && (
            <div className="bg-green-50 border border-green-100 rounded-[2.5rem] p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center text-green-600 mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900">Great job!</h3>
                <p className="text-slate-600 font-medium">Your translation looks great! Ready to generate flashcards.</p>
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
            Generate Flashcards
            <ArrowRight className="w-5 h-5" />
          </Link>
        </ActionBar>
        
        <div className="h-24" />
      </PageWrapper>
    </MainLayout>
  );
}
