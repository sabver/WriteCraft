'use client';

import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { ReviewItem } from '@/components/review/ReviewItem';
import { ArrowLeft, Edit2, Layers, Calendar } from 'lucide-react';
import Link from 'next/link';
import { SceneBadge } from '@/components/common/SceneBadge';
import { BlockLabel } from '@/components/common/BlockLabel';
import { PageWrapper } from '@/components/common/PageWrapper';
import { ReviewIssue } from '@/lib/types';

export default function HistoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  
  // Mock data for detail
  const record = {
    id: id,
    scene: 'interview' as const,
    date: '2024-02-27',
    source: 'Tell me about a time you handled a difficult situation with a coworker.',
    translation: 'I once had a disagreement with a colleague about project priorities, but we resolved it by discussing our goals and finding a compromise.',
    aiReference: 'I once encountered a conflict with a teammate regarding project priorities. We addressed it by openly discussing our shared objectives and reaching a mutually beneficial compromise.',
    issues: [
      {
        id: '1',
        type: 'word-choice',
        title: 'More Precise Vocabulary',
        original: 'had a disagreement',
        revised: 'encountered a conflict',
        reason: "'Encountered a conflict' sounds more professional in an interview context.",
        severity: 'medium'
      },
      {
        id: '2',
        type: 'grammar',
        title: 'Sentence Flow',
        original: 'discussing our goals',
        revised: 'openly discussing our shared objectives',
        reason: "Adding 'openly' and 'shared' emphasizes collaboration.",
        severity: 'low'
      }
    ] as ReviewIssue[]
  };

  return (
    <MainLayout>
      <PageWrapper>
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <Link href="/history" className="h-12 w-12 flex items-center justify-center rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all">
              <ArrowLeft className="w-6 h-6 text-slate-600" />
            </Link>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <SceneBadge type={record.scene} />
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {record.date}
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight font-display">Practice Session Detail</h2>
            </div>
          </div>
          
          <Link 
            href="/interview"
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
          >
            <Edit2 className="w-4 h-4" />
            Re-do Exercise
          </Link>
        </header>

        <div className="grid grid-cols-1 gap-8">
          <section className="space-y-4">
            <BlockLabel>Source Text</BlockLabel>
            <div className="bg-amber-50 border border-amber-100 rounded-3xl p-8 text-xl font-bold text-slate-800 leading-relaxed shadow-sm">
              {record.source}
            </div>
          </section>

          <section className="space-y-4">
            <BlockLabel>Your Translation</BlockLabel>
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-lg font-medium text-slate-700 leading-relaxed shadow-sm">
              {record.translation}
            </div>
          </section>

          <section className="space-y-6">
            <BlockLabel>AI Review & Feedback</BlockLabel>
            <div className="space-y-6">
              {record.issues.map((issue) => (
                <ReviewItem 
                  key={issue.id} 
                  issue={issue} 
                  onGenerateFlashcard={() => {}} 
                />
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <BlockLabel>Related Flashcards</BlockLabel>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {[1, 2].map(i => (
                <Link 
                  key={i}
                  href="/flashcard/review"
                  className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-6 py-4 shrink-0 hover:border-primary transition-all group"
                >
                  <Layers className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                  <span className="text-sm font-bold text-slate-700">Flashcard #{i}</span>
                </Link>
              ))}
            </div>
          </section>
        </div>
        
        <div className="h-20" />
      </PageWrapper>
    </MainLayout>
  );
}
