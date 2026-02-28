'use client';

import React, { useState } from 'react';
import { ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlockLabel } from '@/components/common/BlockLabel';
import { ActionBar } from '@/components/common/ActionBar';
import { Button } from '@/components/ui/button';

interface TranslationPanelProps {
  sourceText: string;
  aiReference: string;
  onSubmit: (translation: string) => void;
}

export function TranslationPanel({ sourceText, aiReference, onSubmit }: TranslationPanelProps) {
  const [translation, setTranslation] = useState('');
  const [showReference, setShowReference] = useState(false);

  const canSubmit = translation.trim().length >= 10;

  return (
    <div className="space-y-10 pb-24">
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <BlockLabel>Source Text</BlockLabel>
          <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded uppercase tracking-widest">Reference</span>
        </div>
        <div className="bg-amber-50 border-2 border-amber-200 rounded-[2.5rem] p-10 shadow-inner">
          <p className="text-2xl md:text-3xl font-black text-slate-800 leading-tight font-display tracking-tight">
            {sourceText}
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <BlockLabel>Your Translation</BlockLabel>
          <span className={cn(
            "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest transition-colors",
            canSubmit ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400"
          )}>
            {translation.length} / 10+ chars
          </span>
        </div>
        <textarea
          id="translation-input"
          aria-label="Your English translation"
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
          placeholder="Write your English translation here..."
          className="w-full min-h-[240px] bg-white border-2 border-slate-200 rounded-[2.5rem] p-10 text-xl font-medium text-slate-700 placeholder-slate-300 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all resize-none leading-relaxed shadow-sm"
        />
      </section>

      <section className="space-y-4">
        <button
          type="button"
          onClick={() => setShowReference(!showReference)}
          className="flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-sm font-bold group"
          aria-expanded={showReference}
          aria-controls="ai-reference-content"
        >
          {showReference ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          {showReference ? "Hide AI Reference Translation" : "Show AI Reference Translation"}
        </button>
        
        {showReference && (
          <div 
            id="ai-reference-content"
            className="bg-slate-50 border border-slate-200 rounded-3xl p-8 animate-in fade-in slide-in-from-top-4 duration-300"
          >
            <p className="text-lg font-bold text-slate-600 italic leading-relaxed">
              {aiReference}
            </p>
          </div>
        )}
      </section>

      <ActionBar>
        <Button
          onClick={() => onSubmit(translation)}
          disabled={!canSubmit}
          size="lg"
          className="px-12 py-7 rounded-full text-xl font-black shadow-2xl shadow-primary/40 text-white"
        >
          <Sparkles className="w-6 h-6 mr-2" />
          Submit for AI Review
          <ArrowRight className="w-6 h-6 ml-2" />
        </Button>
      </ActionBar>
    </div>
  );
}
