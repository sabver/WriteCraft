'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Info, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
import { IssueBadge } from '@/components/common/IssueBadge';
import { BlockLabel } from '@/components/common/BlockLabel';
import type { ReviewIssue } from '@/lib/types';

interface ReviewItemProps {
  issue: ReviewIssue;
  onGenerateFlashcard?: (issue: ReviewIssue) => void;
}

export function ReviewItem({ issue, onGenerateFlashcard }: ReviewItemProps) {
  const t = useTranslations('reviewItem');
  const severityText =
    issue.severity === 'high'
      ? t('highPriority')
      : issue.severity === 'medium'
      ? t('mediumPriority')
      : t('lowPriority');

  return (
    <div className="bg-app-surface rounded-[2.5rem] shadow-sm border border-app-border overflow-hidden transition-all hover:shadow-md">
      <div className="p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <IssueBadge type={issue.type} />
            <h3 className="text-xl font-bold text-app-text font-display tracking-tight">{issue.title}</h3>
          </div>
          <span
            className={cn(
              'px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border self-start md:self-center',
              issue.severity === 'high'
                ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/40'
                : issue.severity === 'medium'
                ? 'bg-orange-50 text-orange-600 border-orange-100 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800/40'
                : 'bg-app-surface-muted text-app-text-muted border-app-border',
            )}
          >
            {severityText}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="p-6 rounded-3xl bg-red-50/50 dark:bg-red-900/20 border border-red-100/50 dark:border-red-800/30">
            <BlockLabel className="mb-4 text-red-600">{t('originalLabel')}</BlockLabel>
            <p className="text-app-text font-medium leading-relaxed text-lg">{issue.original}</p>
          </div>
          <div className="p-6 rounded-3xl bg-green-50/50 dark:bg-green-900/20 border border-green-100/50 dark:border-green-800/30">
            <BlockLabel className="mb-4 text-green-600">{t('revisedLabel')}</BlockLabel>
            <p className="text-app-text font-bold leading-relaxed text-lg">{issue.revised}</p>
          </div>
        </div>

        <div className="bg-app-surface-muted rounded-3xl p-8 flex gap-5 items-start">
          <div className="bg-app-surface rounded-xl p-2 shadow-sm shrink-0">
            <Info className="w-5 h-5 text-primary" />
          </div>
          <div>
            <BlockLabel className="mb-2">{t('reasonLabel')}</BlockLabel>
            <p className="text-app-text-muted leading-relaxed font-medium">{issue.reason}</p>
          </div>
        </div>
      </div>

      {onGenerateFlashcard && (
        <div className="bg-app-surface-muted px-10 py-6 border-t border-app-border flex justify-end">
          <button
            type="button"
            onClick={() => onGenerateFlashcard(issue)}
            className="flex items-center gap-3 bg-app-surface border border-app-border hover:border-primary text-app-text px-8 py-3.5 rounded-2xl text-sm font-bold transition-all shadow-sm hover:shadow-md active:scale-95 group"
          >
            <Layers className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
            {t('generateFlashcard')}
          </button>
        </div>
      )}
    </div>
  );
}
