'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Edit2, Layers, Calendar, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { ReviewItem } from '@/components/review/ReviewItem';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { SceneBadge } from '@/components/common/SceneBadge';
import { BlockLabel } from '@/components/common/BlockLabel';
import { PageWrapper } from '@/components/common/PageWrapper';
import { getSession } from '@/services/sessions';
import type { SessionDetail, ReviewIssue, IssueType } from '@/lib/types';

function normalizeIssue(i: ReviewIssue): ReviewIssue {
  const rawType = i.type as string;
  const rawSeverity = i.severity as string;
  return {
    ...i,
    type: rawType === 'WORD_CHOICE' ? 'word-choice' : (rawType.toLowerCase() as IssueType),
    severity: rawSeverity.toLowerCase() as 'high' | 'medium' | 'low',
  };
}

export default function HistoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [session, setSession] = useState<SessionDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const t = useTranslations('historyDetail');

  useEffect(() => {
    getSession(id)
      .then(setSession)
      .catch((e: Error) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <MainLayout>
        <PageWrapper>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} variant="detail" />
            ))}
          </div>
        </PageWrapper>
      </MainLayout>
    );
  }

  if (error || !session) {
    return (
      <MainLayout>
        <PageWrapper className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-red-500 mb-6">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">{t('notFoundTitle')}</h2>
          <p className="text-slate-500 font-medium mb-8 max-w-md">{error ?? t('notFoundBody')}</p>
          <Link href="/history" className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all">
            {t('backBtn')}
          </Link>
        </PageWrapper>
      </MainLayout>
    );
  }

  const issues = session.issues.map(normalizeIssue);
  const scene = session.scene.toLowerCase() as 'interview' | 'daily';

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
                <SceneBadge type={scene} />
                <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {new Date(session.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight font-display">{t('pageTitle')}</h2>
            </div>
          </div>

          <Link
            href={`/${scene}`}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
          >
            <Edit2 className="w-4 h-4" />
            {t('redoBtn')}
          </Link>
        </header>

        <div className="grid grid-cols-1 gap-8">
          <section className="space-y-4">
            <BlockLabel>{t('sourceLabel')}</BlockLabel>
            <div className="bg-amber-50 border border-amber-100 rounded-3xl p-8 text-xl font-bold text-slate-800 leading-relaxed shadow-sm">
              {session.sourceText}
            </div>
          </section>

          <section className="space-y-4">
            <BlockLabel>{t('translationLabel')}</BlockLabel>
            <div className="bg-white border border-slate-200 rounded-3xl p-8 text-lg font-medium text-slate-700 leading-relaxed shadow-sm">
              {session.userTranslation}
            </div>
          </section>

          <section className="space-y-6">
            <BlockLabel>{t('aiReviewLabel')}</BlockLabel>
            <div className="space-y-6">
              {issues.map((issue) => (
                <ReviewItem key={issue.id} issue={issue} onGenerateFlashcard={() => {}} />
              ))}
              {issues.length === 0 && <p className="text-slate-500 font-medium text-center py-8">{t('noIssues')}</p>}
            </div>
          </section>

          {session.flashcardIds.length > 0 && (
            <section className="space-y-4">
              <BlockLabel>{t('flashcardsLabel')}</BlockLabel>
              <div className="flex gap-4 overflow-x-auto pb-4">
                {session.flashcardIds.map((fid, i) => (
                  <Link
                    key={fid}
                    href="/flashcard/review"
                    className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl px-6 py-4 shrink-0 hover:border-primary transition-all group"
                  >
                    <Layers className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                    <span className="text-sm font-bold text-slate-700">{t('flashcardN', { n: i + 1 })}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="h-20" />
      </PageWrapper>
    </MainLayout>
  );
}
