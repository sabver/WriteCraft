'use client';

import React from 'react';
import { Info, Layers } from 'lucide-react';
import { ReviewIssue } from '@/lib/types';
import { cn } from '@/lib/utils';
import { IssueBadge } from '@/components/common/IssueBadge';
import { BlockLabel } from '@/components/common/BlockLabel';

interface ReviewItemProps {
  issue: ReviewIssue;
  onGenerateFlashcard: (issue: ReviewIssue) => void;
}

export function ReviewItem({ issue, onGenerateFlashcard }: ReviewItemProps) {
  return (
    <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md">
      <div className="p-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-4">
            <IssueBadge type={issue.type} />
            <h3 className="text-xl font-bold text-slate-900 font-display tracking-tight">{issue.title}</h3>
          </div>
          <span className={cn(
            "px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border self-start md:self-center",
            issue.severity === 'high' ? "bg-red-50 text-red-600 border-red-100" : 
            issue.severity === 'medium' ? "bg-orange-50 text-orange-600 border-orange-100" : 
            "bg-slate-50 text-slate-600 border-slate-100"
          )}>
            {issue.severity} Priority
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="p-6 rounded-3xl bg-red-50/50 border border-red-100/50">
            <BlockLabel className="mb-4 text-red-600">Original</BlockLabel>
            <p className="text-slate-700 font-medium leading-relaxed text-lg">
              {issue.original}
            </p>
          </div>
          <div className="p-6 rounded-3xl bg-green-50/50 border border-green-100/50">
            <BlockLabel className="mb-4 text-green-600">Revised</BlockLabel>
            <p className="text-slate-700 font-bold leading-relaxed text-lg">
              {issue.revised}
            </p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-3xl p-8 flex gap-5 items-start">
          <div className="bg-white rounded-xl p-2 shadow-sm shrink-0">
            <Info className="w-5 h-5 text-primary" />
          </div>
          <div>
            <BlockLabel className="mb-2">Reason</BlockLabel>
            <p className="text-slate-600 leading-relaxed font-medium">
              {issue.reason}
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-50/50 px-10 py-6 border-t border-slate-100 flex justify-end">
        <button 
          type="button"
          onClick={() => onGenerateFlashcard(issue)}
          className="flex items-center gap-3 bg-white border border-slate-200 hover:border-primary text-slate-700 px-8 py-3.5 rounded-2xl text-sm font-bold transition-all shadow-sm hover:shadow-md active:scale-95 group"
        >
          <Layers className="w-5 h-5 text-primary group-hover:scale-110 transition-transform" />
          Generate Flashcard
        </button>
      </div>
    </div>
  );
}
