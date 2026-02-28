'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DailyContextSchema } from '@/lib/schemas';
import { z } from 'zod';
import { ChevronDown, ArrowRight, Wand2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlockLabel } from '@/components/common/BlockLabel';
import { Button } from '@/components/ui/button';

type DailyContext = z.infer<typeof DailyContextSchema>;

export function DailyContextForm({ onNext }: { onNext: (data: DailyContext) => void }) {
  const { register, handleSubmit, formState: { isValid } } = useForm<DailyContext>({
    resolver: zodResolver(DailyContextSchema),
    mode: 'onChange',
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <label htmlFor="daily-setting" className="block">
            <BlockLabel>
              Conversation Setting <span className="text-slate-400 font-normal">(Optional)</span>
            </BlockLabel>
          </label>
          <div className="relative">
            <select 
              id="daily-setting"
              {...register('setting')}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-3xl px-6 py-5 text-slate-900 focus:ring-2 focus:ring-primary outline-none cursor-pointer font-medium text-xl"
            >
              <option value="">Select a setting...</option>
              <option value="coffee-shop">Coffee Shop</option>
              <option value="restaurant">Restaurant</option>
              <option value="airport">Airport</option>
              <option value="hotel">Hotel</option>
              <option value="office">Office</option>
              <option value="other">Other</option>
            </select>
            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-7 h-7" />
          </div>
          <p className="text-xs text-slate-400 font-medium">Where does this conversation take place?</p>
        </div>

        <div className="space-y-4">
          <BlockLabel>
            Formality Level <span className="text-slate-400 font-normal">(Optional)</span>
          </BlockLabel>
          <div className="flex flex-wrap gap-4">
            {['Casual', 'Neutral', 'Formal'].map((level) => (
              <label key={level} className="cursor-pointer">
                <input type="radio" {...register('formality')} value={level.toLowerCase()} className="hidden peer" />
                <div className="px-8 py-4 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-all shadow-sm">
                  {level}
                </div>
              </label>
            ))}
          </div>
          <p className="text-xs text-slate-400 font-medium">How polite or relaxed should the language be?</p>
        </div>
      </div>

      <div className="bg-green-50/50 rounded-[2.5rem] p-10 border border-green-100 flex items-start gap-6">
        <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center text-green-600 shrink-0">
          <Wand2 className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-900 mb-2">Quick Tip</h4>
          <p className="text-slate-600 font-medium leading-relaxed">
            Daily practice is great for fragmented expressions. You can skip these fields if you just want to translate a specific phrase quickly.
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between pt-10 border-t border-slate-100 gap-8">
        <div className="text-sm font-bold text-slate-400">
          Context fields are optional — feel free to skip.
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => onNext({ setting: '', formality: 'Neutral' })}
            className="flex-1 md:flex-none h-14 px-10 rounded-2xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Skip Directly
          </Button>
          <Button 
            type="submit"
            className="flex-1 md:flex-none h-14 px-12 rounded-2xl font-black shadow-xl shadow-primary/30 flex items-center justify-center gap-3 text-white"
          >
            Start Writing
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex justify-center items-center gap-10 text-slate-400 pt-6">
        <div className="flex items-center gap-2.5">
          <Clock className="w-5 h-5" />
          <span className="text-[10px] uppercase font-black tracking-[0.15em]">~5 Min Session</span>
        </div>
      </div>
    </form>
  );
}
