'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ActionBarProps {
  children: React.ReactNode;
  className?: string;
}

export function ActionBar({ children, className }: ActionBarProps) {
  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 md:relative md:bottom-auto bg-white/80 backdrop-blur-md border-t border-slate-100 p-4 md:p-0 md:bg-transparent md:border-none md:backdrop-blur-none z-50",
      className
    )}>
      <div className="max-w-5xl mx-auto flex items-center justify-center md:justify-end gap-4">
        {children}
      </div>
    </div>
  );
}
