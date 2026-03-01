'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Languages, Sparkles, Mic, Clipboard, Volume2, Layers, Search } from 'lucide-react';
import { SceneCard } from '@/components/scene/SceneCard';
import { PageWrapper } from '@/components/common/PageWrapper';
import { BlockLabel } from '@/components/common/BlockLabel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MainLayout from '@/components/layout/MainLayout';

export default function HomePage() {
  const [text, setText] = useState('');
  const t = useTranslations('home');

  return (
    <MainLayout>
      <PageWrapper>
        <div className="max-w-5xl mx-auto space-y-12 pb-24">
          <section>
            <div className="mb-8">
              <h2 className="text-4xl font-black text-app-text tracking-tight mb-2 font-display">{t('practiceScenes')}</h2>
              <p className="text-app-text-muted text-lg font-medium">{t('practiceSubtitle')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <SceneCard type="daily" active />
              <SceneCard type="interview" />
            </div>
          </section>

          <section className="space-y-8">
            <div className="bg-app-surface rounded-[2.5rem] border border-app-border shadow-md overflow-hidden">
              <div className="p-8 border-b border-app-border flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Languages className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-xl text-app-text">{t('quickTranslation')}</h3>
                    <p className="text-xs text-app-text-muted font-bold uppercase tracking-widest">{t('instantFeedback')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <select className="bg-app-surface border-2 border-app-border rounded-xl px-4 py-2 text-xs font-bold text-app-text-muted focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none cursor-pointer transition-all">
                    <option>{t('translationLabel', { text: 'EN -> ZH-CN' })}</option>
                    <option>{t('translationLabel', { text: 'EN -> JA' })}</option>
                  </select>
                  <Button size="sm" className="rounded-xl px-6 font-bold shadow-lg shadow-primary/20 text-white">
                    {t('analyze')}
                    <Sparkles className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-app-border">
                <div className="p-10 h-80 flex flex-col">
                  <BlockLabel className="mb-6">{t('yourExpression')}</BlockLabel>
                  <textarea
                    id="quick-translate-input"
                    aria-label={t('yourExpression')}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="flex-1 w-full bg-transparent border-none p-0 focus:ring-0 focus:outline-none text-2xl text-app-text placeholder-app-text-muted resize-none leading-relaxed font-medium"
                    placeholder={t('expressionPlaceholder')}
                  />
                  <div className="mt-6 flex items-center gap-4 text-app-text-muted">
                    <button type="button" className="hover:text-primary transition-colors p-2 rounded-xl hover:bg-app-surface-muted" aria-label={t('voiceInput')}>
                      <Mic className="w-5 h-5" />
                    </button>
                    <button type="button" className="hover:text-primary transition-colors p-2 rounded-xl hover:bg-app-surface-muted" aria-label={t('pasteClipboard')}>
                      <Clipboard className="w-5 h-5" />
                    </button>
                    <span className="ml-auto text-xs font-bold text-app-text-muted tracking-widest">{t('charCount', { count: text.length })}</span>
                  </div>
                </div>

                <div className="p-10 h-80 flex flex-col bg-app-surface-muted">
                  <BlockLabel className="mb-6">{t('aiFeedbackTitle')}</BlockLabel>
                  <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                    <div className="w-16 h-16 rounded-3xl bg-app-surface shadow-sm flex items-center justify-center text-app-text-muted mb-6">
                      <Sparkles className="w-8 h-8" />
                    </div>
                    <p className="text-app-text-muted font-medium max-w-[260px] leading-relaxed">{t('aiFeedbackEmpty')}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between px-1">
                <BlockLabel>{t('todayFragments')}</BlockLabel>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-app-text-muted" />
                  <Input
                    placeholder={t('searchFragments')}
                    className="pl-10 h-9 text-xs rounded-xl border-app-border"
                    aria-label={t('searchFragments')}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { native: 'I want to rent an apartment with a balcony in downtown.', en: "I'd like to rent an apartment with a balcony in the city center." },
                  { native: 'Please bring me the check.', en: 'Check, please.' },
                ].map((item, i) => (
                  <div key={i} className="group bg-app-surface p-6 rounded-3xl border border-app-border flex items-center justify-between hover:border-primary/30 transition-all hover:shadow-md cursor-pointer">
                    <div className="flex flex-col gap-1">
                      <p className="text-lg font-bold text-app-text">&quot;{item.native}&quot;</p>
                      <p className="text-sm text-app-text-muted font-medium">{t('translationLabel', { text: item.en })}</p>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                      <button type="button" className="p-3 text-app-text-muted hover:text-primary hover:bg-primary/5 rounded-2xl transition-all" aria-label={t('listenAria')}>
                        <Volume2 className="w-5 h-5" />
                      </button>
                      <button type="button" className="p-3 text-app-text-muted hover:text-primary hover:bg-primary/5 rounded-2xl transition-all" aria-label={t('saveFlashcardsAria')}>
                        <Layers className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </PageWrapper>
    </MainLayout>
  );
}
