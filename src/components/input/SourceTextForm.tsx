'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, Wand2, Clock } from 'lucide-react';
import { SourceTextSchema } from '@/lib/schemas';
import { cn } from '@/lib/utils';
import { BlockLabel } from '@/components/common/BlockLabel';
import { Button } from '@/components/ui/button';

type SourceTextData = z.infer<typeof SourceTextSchema>;

interface SourceTextFormProps {
  onNext: (data: SourceTextData) => void;
  placeholder?: string;
  hint?: string;
}

export function SourceTextForm({ onNext, placeholder, hint }: SourceTextFormProps) {
  const t = useTranslations('sourceText');
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<SourceTextData>({
    resolver: zodResolver(SourceTextSchema),
    mode: 'onChange',
  });

  const resolvedHint = hint ?? t('hint');
  const resolvedPlaceholder = placeholder ?? '';

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-10">
      <div className="space-y-4">
        <label htmlFor="source-text" className="block">
          <BlockLabel>
            {t('label')} <span className="text-red-500">*</span>
          </BlockLabel>
        </label>
        <textarea
          id="source-text"
          {...register('sourceText')}
          className={cn(
            'w-full bg-app-surface-muted border rounded-3xl px-6 py-5 text-app-text placeholder:text-app-text-muted focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none text-xl font-medium',
            errors.sourceText ? 'border-red-300' : 'border-app-border',
          )}
          placeholder={resolvedPlaceholder}
          rows={6}
          aria-describedby="source-hint"
        />
        {errors.sourceText && <p className="text-xs text-red-500 font-bold">{errors.sourceText.message}</p>}
        <p id="source-hint" className="text-xs text-app-text-muted font-medium">{resolvedHint}</p>
      </div>

      <div className="bg-amber-50/50 rounded-[2.5rem] p-10 border border-amber-100 flex items-start gap-6">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
          <Wand2 className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-app-text mb-2">{t('whyTitle')}</h4>
          <p className="text-app-text-muted font-medium leading-relaxed">{t('whyBody')}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-end pt-10 border-t border-app-border gap-8">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Button
            type="submit"
            disabled={!isValid}
            className="flex-1 md:flex-none h-14 px-12 rounded-2xl font-black shadow-xl shadow-primary/30 flex items-center justify-center gap-3 text-white"
          >
            {t('nextBtn')}
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex justify-center items-center gap-10 text-app-text-muted pt-6">
        <div className="flex items-center gap-2.5">
          <Clock className="w-5 h-5" />
          <span className="text-[10px] uppercase font-black tracking-[0.15em]">{t('duration')}</span>
        </div>
      </div>
    </form>
  );
}
