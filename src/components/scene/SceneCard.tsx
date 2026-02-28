import React from 'react';
import Link from 'next/link';
import { Briefcase, Calendar, Bolt, SignalHigh } from 'lucide-react';
import { cn } from '@/lib/utils';
import { SceneBadge } from '@/components/common/SceneBadge';

interface SceneCardProps {
  type: 'interview' | 'daily';
  active?: boolean;
}

export function SceneCard({ type, active }: SceneCardProps) {
  const isInterview = type === 'interview';
  
  return (
    <Link 
      href={isInterview ? '/interview' : '/daily'}
      className={cn(
        "group relative bg-white rounded-3xl overflow-hidden shadow-sm border-2 transition-all hover:shadow-md",
        active ? "border-primary" : "border-transparent hover:border-slate-200"
      )}
      aria-label={`Start ${isInterview ? 'Job Interview' : 'Daily Practice'} practice`}
    >
      {active && (
        <div className="absolute top-4 right-4 z-10">
          <SceneBadge type={type} />
        </div>
      )}
      <div className="flex p-8 gap-8">
        <div className={cn(
          "h-24 w-24 flex-shrink-0 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-105 shadow-sm",
          isInterview ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"
        )}>
          {isInterview ? <Briefcase className="w-10 h-10" /> : <Calendar className="w-10 h-10" />}
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-2xl text-slate-900 mb-2 group-hover:text-primary transition-colors font-display tracking-tight">
            {isInterview ? 'Job Interview' : 'Daily Practice'}
          </h3>
          <p className="text-slate-500 font-medium leading-relaxed">
            {isInterview 
              ? 'Structured practice for professional career-focused conversations.' 
              : 'Quick translations for fragmented expressions and everyday thoughts.'}
          </p>
          <div className="mt-4 flex items-center gap-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
            {isInterview ? (
              <div className="flex items-center gap-1.5">
                <SignalHigh className="w-4 h-4" />
                Intermediate
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Bolt className="w-4 h-4" />
                Instant Mode
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
