'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Search, Calendar as CalendarIcon, ArrowRight, BookOpen, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import { PageWrapper } from '@/components/common/PageWrapper';
import { SceneBadge } from '@/components/common/SceneBadge';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { cn } from '@/lib/utils';
import { getSessions } from '@/services/sessions';
import type { SessionListItem, HistoryFilter } from '@/lib/types';

export default function HistoryPage() {
  const [sessions, setSessions] = useState<SessionListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [sceneFilter, setSceneFilter] = useState<'all' | 'interview' | 'daily'>('all');
  const [rangeFilter, setRangeFilter] = useState<'all' | '7d' | '30d'>('all');
  const [searchQ, setSearchQ] = useState('');
  const t = useTranslations('history');

  useEffect(() => {
    const filter: HistoryFilter = {
      scene: sceneFilter !== 'all' ? sceneFilter : undefined,
      range: rangeFilter !== 'all' ? rangeFilter : undefined,
      q: searchQ || undefined,
    };

    const delay = searchQ ? 300 : 0;
    const timer = setTimeout(() => {
      setLoading(true);
      setFetchError(null);
      getSessions(filter)
        .then(setSessions)
        .catch(() => {
          setFetchError(t('loadError'));
          setSessions([]);
        })
        .finally(() => setLoading(false));
    }, delay);

    return () => clearTimeout(timer);
  }, [sceneFilter, rangeFilter, searchQ, t]);

  const sceneLabels: Record<'all' | 'interview' | 'daily', string> = {
    all: t('filterAll'),
    interview: t('filterInterview'),
    daily: t('filterDaily'),
  };
  const rangeLabels: Record<'all' | '7d' | '30d', string> = {
    all: t('timeAll'),
    '7d': t('time7d'),
    '30d': t('time30d'),
  };

  return (
    <MainLayout>
      <PageWrapper>
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-app-text tracking-tight mb-1 font-display">{t('pageTitle')}</h2>
            <p className="text-app-text-muted text-lg font-medium">{t('pageSubtitle')}</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-text-muted" />
              <input
                className="pl-11 pr-4 py-2.5 bg-app-surface border border-app-border rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all w-full md:w-64"
                placeholder={t('searchPlaceholder')}
                aria-label={t('searchPlaceholder')}
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
              />
            </div>
          </div>
        </header>

        <div className="flex items-center gap-4 border-b border-app-border pb-2 overflow-x-auto whitespace-nowrap">
          {(['all', 'interview', 'daily'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSceneFilter(filter)}
              className={cn(
                'px-4 py-2 text-sm font-bold uppercase tracking-widest transition-all border-b-2',
                sceneFilter === filter ? 'text-primary border-primary' : 'text-app-text-muted border-transparent hover:text-app-text',
              )}
            >
              {sceneLabels[filter]}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            {(['all', '7d', '30d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRangeFilter(r)}
                className={cn(
                  'px-3 py-1.5 text-xs font-bold rounded-lg transition-all',
                  rangeFilter === r ? 'bg-primary text-white' : 'bg-app-surface-muted text-app-text-muted hover:bg-app-surface-muted',
                )}
              >
                {rangeLabels[r]}
              </button>
            ))}
          </div>
        </div>

        {fetchError && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-sm font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            {fetchError}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {sessions.map((s) => (
              <Link
                key={s.id}
                href={`/history/${s.id}`}
                className="group bg-app-surface p-6 rounded-3xl border border-app-border flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-6 flex-1 min-w-0">
                  <div
                    className={cn(
                      'w-14 h-14 rounded-2xl flex items-center justify-center shrink-0',
                      s.scene === 'INTERVIEW' ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
                    )}
                  >
                    <CalendarIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <SceneBadge type={s.scene.toLowerCase() as 'interview' | 'daily'} />
                      <span className="text-xs font-bold text-app-text-muted">{new Date(s.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-app-text font-bold truncate mb-1">{s.sourceText}</p>
                    <p className="text-app-text-muted text-sm font-medium truncate">{s.userTranslation}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 shrink-0">
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-app-text-muted uppercase tracking-widest">{t('issuesLabel')}</span>
                    <span
                      className={cn(
                        'text-sm font-black',
                        s.issueCount > 0 ? 'text-orange-500' : 'text-green-500',
                      )}
                    >
                      {s.issueCount === 0 ? t('perfectLabel') : t('issueCount', { count: s.issueCount })}
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-app-surface-muted flex items-center justify-center text-app-text-muted group-hover:bg-primary group-hover:text-white transition-all">
                    <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
              </Link>
            ))}

            {sessions.length === 0 && (
              <div className="text-center py-20 bg-app-surface rounded-[3rem] border border-dashed border-app-border flex flex-col items-center justify-center space-y-6">
                <div className="w-20 h-20 bg-app-surface-muted rounded-3xl flex items-center justify-center text-app-text-muted">
                  <BookOpen className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <p className="text-app-text font-black text-xl">{t('emptyTitle')}</p>
                  <p className="text-app-text-muted font-medium">{t('emptyBody')}</p>
                </div>
                <Link href="/" className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                  {t('startPracticeBtn')}
                </Link>
              </div>
            )}
          </div>
        )}
      </PageWrapper>
    </MainLayout>
  );
}
