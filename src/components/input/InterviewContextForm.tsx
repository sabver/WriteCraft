'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronDown, ArrowRight, Wand2, Clock } from 'lucide-react';
import { InterviewContextSchema } from '@/lib/schemas';
import { cn } from '@/lib/utils';
import { BlockLabel } from '@/components/common/BlockLabel';
import { Button } from '@/components/ui/button';

type InterviewContext = z.infer<typeof InterviewContextSchema>;

const TONE_OPTIONS = [
  { value: 'Professional', key: 'toneProfessional' as const },
  { value: 'Neutral', key: 'toneNeutral' as const },
  { value: 'Confident', key: 'toneConfident' as const },
];

export function InterviewContextForm({ onNext }: { onNext: (data: InterviewContext) => void }) {
  const t = useTranslations('interviewContext');
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<InterviewContext>({
    resolver: zodResolver(InterviewContextSchema),
    mode: 'onChange',
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-10">
      <div className="space-y-4">
        <label htmlFor="interview-question" className="block">
          <BlockLabel>
            {t('questionLabel')} <span className="text-red-500">*</span>
          </BlockLabel>
        </label>
        <textarea
          id="interview-question"
          {...register('jobDescription')}
          className={cn(
            'w-full bg-app-surface-muted border rounded-3xl px-6 py-5 text-app-text placeholder:text-app-text-muted focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none text-xl font-medium',
            errors.jobDescription ? 'border-red-300' : 'border-app-border',
          )}
          placeholder={t('questionPlaceholder')}
          rows={4}
          aria-describedby="question-hint"
        />
        {errors.jobDescription && <p className="text-xs text-red-500 font-bold">{errors.jobDescription.message}</p>}
        <p id="question-hint" className="text-xs text-app-text-muted font-medium">{t('questionHint')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <label htmlFor="job-role" className="block">
            <BlockLabel>{t('roleLabel')}</BlockLabel>
          </label>
          <div className="relative">
            <select
              id="job-role"
              {...register('companyBackground')}
              className="w-full appearance-none bg-app-surface-muted border border-app-border rounded-2xl px-6 py-4 text-app-text focus:ring-2 focus:ring-primary outline-none cursor-pointer font-medium text-lg"
            >
              <option value="backend">{t('roleBackend')}</option>
              <option value="pm">{t('roleProduct')}</option>
              <option value="designer">{t('roleUX')}</option>
              <option value="data">{t('roleData')}</option>
            </select>
            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-app-text-muted pointer-events-none w-6 h-6" />
          </div>
        </div>

        <div className="space-y-4">
          <BlockLabel>{t('toneLabel')}</BlockLabel>
          <div className="flex flex-wrap gap-3">
            {TONE_OPTIONS.map((option) => (
              <label key={option.value} className="cursor-pointer">
                <input type="radio" name="tone" value={option.value} className="hidden peer" defaultChecked={option.value === 'Professional'} />
                <div className="px-6 py-3 rounded-2xl border border-app-border text-sm font-bold text-app-text-muted peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-all shadow-sm">
                  {t(option.key)}
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <details className="group bg-app-surface-muted/50 rounded-3xl border border-app-border overflow-hidden">
        <summary className="flex items-center justify-between px-8 py-5 cursor-pointer list-none hover:bg-app-surface-muted/50 transition-colors">
          <span className="text-xs font-black text-app-text-muted uppercase tracking-widest">{t('advancedOptions')}</span>
          <ChevronDown className="w-5 h-5 text-app-text-muted transition-transform group-open:rotate-180" />
        </summary>
        <div className="px-8 pb-8 pt-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label htmlFor="industry" className="text-xs font-bold text-app-text-muted uppercase tracking-widest">{t('companyLabel')}</label>
              <input id="industry" className="w-full bg-app-surface border border-app-border rounded-xl px-5 py-3 text-sm font-medium focus:ring-2 focus:ring-primary outline-none" placeholder={t('companyPlaceholder')} />
            </div>
            <div className="space-y-3">
              <label htmlFor="interview-type" className="text-xs font-bold text-app-text-muted uppercase tracking-widest">{t('interviewTypeLabel')}</label>
              <div className="relative">
                <select id="interview-type" className="w-full bg-app-surface border border-app-border rounded-xl px-5 py-3 text-sm font-medium appearance-none focus:ring-2 focus:ring-primary outline-none">
                  <option>{t('typeHR')}</option>
                  <option>{t('typeTech')}</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-app-text-muted pointer-events-none w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </details>

      <div className="flex flex-col md:flex-row items-center justify-between pt-10 border-t border-app-border gap-8">
        <label className="flex items-center gap-4 cursor-pointer group">
          <input type="checkbox" className="rounded-lg border-slate-300 text-primary focus:ring-primary h-6 w-6 transition-all" />
          <span className="text-sm font-bold text-app-text-muted group-hover:text-app-text transition-colors">{t('saveTemplate')}</span>
        </label>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Button
            type="button"
            variant="outline"
            className="flex-1 md:flex-none h-14 px-10 rounded-2xl font-bold border-app-border text-app-text-muted hover:bg-app-surface-muted"
          >
            {t('skipBtn')}
          </Button>
          <Button
            type="submit"
            disabled={!isValid}
            className="flex-1 md:flex-none h-14 px-12 rounded-2xl font-black shadow-xl shadow-primary/30 flex items-center justify-center gap-3 text-white"
          >
            {t('startBtn')}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex justify-center items-center gap-10 text-app-text-muted pt-6">
        <div className="flex items-center gap-2.5">
          <Wand2 className="w-5 h-5" />
          <span className="text-[10px] uppercase font-black tracking-[0.15em]">{t('aiPowered')}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Clock className="w-5 h-5" />
          <span className="text-[10px] uppercase font-black tracking-[0.15em]">{t('duration')}</span>
        </div>
      </div>
    </form>
  );
}
