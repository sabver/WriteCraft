'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ChevronDown, ArrowRight, Wand2, Clock } from 'lucide-react';
import { DailyContextSchema } from '@/lib/schemas';
import { BlockLabel } from '@/components/common/BlockLabel';
import { Button } from '@/components/ui/button';

type DailyContext = z.infer<typeof DailyContextSchema>;

const FORMALITY_OPTIONS = [
  { value: 'Casual', key: 'formalityCasual' as const },
  { value: 'Neutral', key: 'formalityNeutral' as const },
  { value: 'Formal', key: 'formalityFormal' as const },
];

export function DailyContextForm({ onNext }: { onNext: (data: DailyContext) => void }) {
  const t = useTranslations('dailyContext');
  const { register, handleSubmit } = useForm<DailyContext>({
    resolver: zodResolver(DailyContextSchema),
    mode: 'onChange',
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <label htmlFor="daily-setting" className="block">
            <BlockLabel>{t('settingLabel')}</BlockLabel>
          </label>
          <div className="relative">
            <select
              id="daily-setting"
              {...register('setting')}
              className="w-full appearance-none bg-app-surface-muted border border-app-border rounded-3xl px-6 py-5 text-app-text focus:ring-2 focus:ring-primary outline-none cursor-pointer font-medium text-xl"
            >
              <option value="">{t('settingPlaceholder')}</option>
              <option value="coffee-shop">{t('settingCoffeeShop')}</option>
              <option value="restaurant">{t('settingRestaurant')}</option>
              <option value="airport">{t('settingAirport')}</option>
              <option value="hotel">{t('settingHotel')}</option>
              <option value="office">{t('settingOffice')}</option>
              <option value="other">{t('settingOther')}</option>
            </select>
            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-app-text-muted pointer-events-none w-7 h-7" />
          </div>
          <p className="text-xs text-app-text-muted font-medium">{t('settingHint')}</p>
        </div>

        <div className="space-y-4">
          <BlockLabel>{t('formalityLabel')}</BlockLabel>
          <div className="flex flex-wrap gap-4">
            {FORMALITY_OPTIONS.map((option) => (
              <label key={option.value} className="cursor-pointer">
                <input type="radio" {...register('formality')} value={option.value} className="hidden peer" />
                <div className="px-8 py-4 rounded-2xl border border-app-border text-sm font-bold text-app-text-muted peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-all shadow-sm">
                  {t(option.key)}
                </div>
              </label>
            ))}
          </div>
          <p className="text-xs text-app-text-muted font-medium">{t('formalityHint')}</p>
        </div>
      </div>

      <div className="bg-app-surface-muted rounded-[2.5rem] p-10 border border-app-border flex items-start gap-6">
        <div className="w-12 h-12 rounded-2xl bg-app-surface flex items-center justify-center text-app-text-muted shrink-0">
          <Wand2 className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-app-text mb-2">{t('tipTitle')}</h4>
          <p className="text-app-text-muted font-medium leading-relaxed">{t('tipBody')}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between pt-10 border-t border-app-border gap-8">
        <div className="text-sm font-bold text-app-text-muted">{t('tipSkipHint')}</div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Button
            type="button"
            variant="outline"
            onClick={() => onNext({ setting: '', formality: 'Neutral' })}
            className="flex-1 md:flex-none h-14 px-10 rounded-2xl font-bold border-app-border text-app-text-muted hover:bg-app-surface-muted"
          >
            {t('skipBtn')}
          </Button>
          <Button
            type="submit"
            className="flex-1 md:flex-none h-14 px-12 rounded-2xl font-black shadow-xl shadow-primary/30 flex items-center justify-center gap-3 text-white"
          >
            {t('startBtn')}
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
