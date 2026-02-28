'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface IssueBadgeProps {
  type: 'grammar' | 'word-choice' | 'structure';
  className?: string;
}

export function IssueBadge({ type, className }: IssueBadgeProps) {
  const config = {
    grammar: { label: 'Grammar', color: 'bg-red-100 text-red-700' },
    'word-choice': { label: 'Word Choice', color: 'bg-yellow-100 text-yellow-700' },
    structure: { label: 'Structure', color: 'bg-purple-100 text-purple-700' },
  };

  const { label, color } = config[type];

  return (
    <span className={cn(
      "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
      color,
      className
    )}>
      {label}
    </span>
  );
}
