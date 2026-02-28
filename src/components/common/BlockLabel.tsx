'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface BlockLabelProps {
  children: React.ReactNode;
  className?: string;
}

export function BlockLabel({ children, className }: BlockLabelProps) {
  return (
    <h3 className={cn(
      "text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1",
      className
    )}>
      {children}
    </h3>
  );
}
