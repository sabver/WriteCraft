'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface IssueBadgeProps {
  type: 'grammar' | 'word-choice' | 'structure';
  className?: string;
}

export function IssueBadge({ type, className }: IssueBadgeProps) {
  const t = useTranslations('common');

  const config = {
    grammar: { labelKey: 'issueGrammar', color: 'bg-red-100 text-red-700' },
    'word-choice': { labelKey: 'issueWordChoice', color: 'bg-yellow-100 text-yellow-700' },
    structure: { labelKey: 'issueStructure', color: 'bg-purple-100 text-purple-700' },
  } as const;

  const { labelKey, color } = config[type];

  return (
    <span className={cn(
      "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
      color,
      className
    )}>
      {t(labelKey)}
    </span>
  );
}
