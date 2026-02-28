'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SceneBadgeProps {
  type: 'interview' | 'daily';
  className?: string;
}

export function SceneBadge({ type, className }: SceneBadgeProps) {
  const isInterview = type === 'interview';
  
  return (
    <span className={cn(
      "text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md",
      isInterview ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700",
      className
    )}>
      {type}
    </span>
  );
}
