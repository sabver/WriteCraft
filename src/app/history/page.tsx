'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { PageWrapper } from '@/components/common/PageWrapper';
import { SceneBadge } from '@/components/common/SceneBadge';
import { Search, Calendar as CalendarIcon, ArrowRight, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const mockHistory = [
  {
    id: '1',
    scene: 'interview' as const,
    date: '2024-02-27',
    source: 'Tell me about a time you handled a difficult situation with a coworker.',
    translation: 'I once had a disagreement with a colleague about project priorities...',
    issues: 3
  },
  {
    id: '2',
    scene: 'daily' as const,
    date: '2024-02-26',
    source: 'I would like to order a large coffee with oat milk, please.',
    translation: 'Quisiera pedir un café grande con leche de avena, por favor.',
    issues: 0
  },
  {
    id: '3',
    scene: 'interview' as const,
    date: '2024-02-25',
    source: 'What are your greatest strengths and weaknesses?',
    translation: 'My strengths include my ability to learn quickly and my strong work ethic...',
    issues: 2
  }
];

export default function HistoryPage() {
  const [sceneFilter, setSceneFilter] = useState<'all' | 'interview' | 'daily'>('all');

  const filteredHistory = mockHistory.filter(item => sceneFilter === 'all' || item.scene === sceneFilter);

  return (
    <MainLayout>
      <PageWrapper>
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-1 font-display">Practice History</h2>
            <p className="text-slate-500 text-lg font-medium">Review your past sessions and track your progress.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                className="pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary outline-none transition-all w-full md:w-64"
                placeholder="Search history..."
                aria-label="Search history"
              />
            </div>
          </div>
        </header>

        <div className="flex items-center gap-4 border-b border-slate-200 pb-2 overflow-x-auto whitespace-nowrap">
          {(['all', 'interview', 'daily'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setSceneFilter(filter)}
              className={cn(
                "px-4 py-2 text-sm font-bold uppercase tracking-widest transition-all border-b-2",
                sceneFilter === filter ? "text-primary border-primary" : "text-slate-400 border-transparent hover:text-slate-600"
              )}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredHistory.map((item) => (
            <Link 
              key={item.id}
              href={`/history/${item.id}`}
              className="group bg-white p-6 rounded-3xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-primary/30 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-6 flex-1 min-w-0">
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
                  item.scene === 'interview' ? "bg-blue-50 text-blue-600" : "bg-green-50 text-green-600"
                )}>
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <SceneBadge type={item.scene} />
                    <span className="text-xs font-bold text-slate-400">{item.date}</span>
                  </div>
                  <p className="text-slate-900 font-bold truncate mb-1">{item.source}</p>
                  <p className="text-slate-500 text-sm font-medium truncate">{item.translation}</p>
                </div>
              </div>

              <div className="flex items-center gap-6 shrink-0">
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Issues</span>
                  <span className={cn(
                    "text-sm font-black",
                    item.issues > 0 ? "text-orange-500" : "text-green-500"
                  )}>
                    {item.issues === 0 ? 'Perfect' : `${item.issues} found`}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filteredHistory.length === 0 && (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200 flex flex-col items-center justify-center space-y-6">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300">
              <BookOpen className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <p className="text-slate-900 font-black text-xl">No history yet</p>
              <p className="text-slate-500 font-medium">Every practice session is a step forward.</p>
            </div>
            <Link 
              href="/"
              className="px-8 py-3 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all"
            >
              Start Practicing
            </Link>
          </div>
        )}
      </PageWrapper>
    </MainLayout>
  );
}
