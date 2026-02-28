'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  className?: string;
  variant?: 'list' | 'detail' | 'flashcard';
}

export function SkeletonCard({ className, variant = 'list' }: SkeletonCardProps) {
  return (
    <div className={cn(
      "bg-white border border-slate-100 rounded-3xl animate-pulse overflow-hidden",
      variant === 'list' && "h-32",
      variant === 'detail' && "h-64",
      variant === 'flashcard' && "aspect-[3/4] max-w-sm w-full",
      className
    )}>
      <div className="w-full h-full bg-slate-50/50" />
    </div>
  );
}
