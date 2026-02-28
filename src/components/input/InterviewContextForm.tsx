'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InterviewContextSchema } from '@/lib/schemas';
import { z } from 'zod';
import { ChevronDown, ArrowRight, Wand2, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BlockLabel } from '@/components/common/BlockLabel';
import { Button } from '@/components/ui/button';

type InterviewContext = z.infer<typeof InterviewContextSchema>;

export function InterviewContextForm({ onNext }: { onNext: (data: InterviewContext) => void }) {
  const { register, handleSubmit, formState: { errors, isValid } } = useForm<InterviewContext>({
    resolver: zodResolver(InterviewContextSchema),
    mode: 'onChange',
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-10">
      <div className="space-y-4">
        <label htmlFor="interview-question" className="block">
          <BlockLabel>
            Interview Question <span className="text-red-500">*</span>
          </BlockLabel>
        </label>
        <textarea 
          id="interview-question"
          {...register('jobDescription')}
          className={cn(
            "w-full bg-slate-50 border rounded-3xl px-6 py-5 text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none text-xl font-medium",
            errors.jobDescription ? "border-red-300" : "border-slate-200"
          )}
          placeholder="e.g., Tell me about yourself"
          rows={4}
          aria-describedby="question-hint"
        />
        {errors.jobDescription && <p className="text-xs text-red-500 font-bold">{errors.jobDescription.message}</p>}
        <p id="question-hint" className="text-xs text-slate-400 font-medium">Specify the question you want to practice answering.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <label htmlFor="job-role" className="block">
            <BlockLabel>Job Role</BlockLabel>
          </label>
          <div className="relative">
            <select 
              id="job-role"
              {...register('companyBackground')}
              className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-700 focus:ring-2 focus:ring-primary outline-none cursor-pointer font-medium text-lg"
            >
              <option value="backend">Backend Engineer</option>
              <option value="pm">Product Manager</option>
              <option value="designer">UX Designer</option>
              <option value="data">Data Scientist</option>
            </select>
            <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-6 h-6" />
          </div>
        </div>

        <div className="space-y-4">
          <BlockLabel>Tone</BlockLabel>
          <div className="flex flex-wrap gap-3">
            {['Professional', 'Neutral', 'Confident'].map((tone) => (
              <label key={tone} className="cursor-pointer">
                <input type="radio" name="tone" value={tone} className="hidden peer" defaultChecked={tone === 'Professional'} />
                <div className="px-6 py-3 rounded-2xl border border-slate-200 text-sm font-bold text-slate-600 peer-checked:bg-primary peer-checked:text-white peer-checked:border-primary transition-all shadow-sm">
                  {tone}
                </div>
              </label>
            ))}
          </div>
        </div>
      </div>

      <details className="group bg-slate-50/50 rounded-3xl border border-slate-100 overflow-hidden">
        <summary className="flex items-center justify-between px-8 py-5 cursor-pointer list-none hover:bg-slate-100/50 transition-colors">
          <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Advanced Options</span>
          <ChevronDown className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-180" />
        </summary>
        <div className="px-8 pb-8 pt-2 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label htmlFor="industry" className="text-xs font-bold text-slate-500 uppercase tracking-widest">Company/Industry</label>
              <input id="industry" className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3 text-sm font-medium focus:ring-2 focus:ring-primary outline-none" placeholder="e.g., Tech, Finance..." />
            </div>
            <div className="space-y-3">
              <label htmlFor="interview-type" className="text-xs font-bold text-slate-500 uppercase tracking-widest">Interview Type</label>
              <div className="relative">
                <select id="interview-type" className="w-full bg-white border border-slate-200 rounded-xl px-5 py-3 text-sm font-medium appearance-none focus:ring-2 focus:ring-primary outline-none">
                  <option>HR Interview</option>
                  <option>Technical Interview</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none w-4 h-4" />
              </div>
            </div>
          </div>
        </div>
      </details>

      <div className="flex flex-col md:flex-row items-center justify-between pt-10 border-t border-slate-100 gap-8">
        <label className="flex items-center gap-4 cursor-pointer group">
          <input type="checkbox" className="rounded-lg border-slate-300 text-primary focus:ring-primary h-6 w-6 transition-all" />
          <span className="text-sm font-bold text-slate-500 group-hover:text-slate-700 transition-colors">Save as Template</span>
        </label>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Button 
            type="button" 
            variant="outline"
            className="flex-1 md:flex-none h-14 px-10 rounded-2xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            Skip
          </Button>
          <Button 
            type="submit"
            disabled={!isValid}
            className="flex-1 md:flex-none h-14 px-12 rounded-2xl font-black shadow-xl shadow-primary/30 flex items-center justify-center gap-3 text-white"
          >
            Start Writing
            <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="flex justify-center items-center gap-10 text-slate-400 pt-6">
        <div className="flex items-center gap-2.5">
          <Wand2 className="w-5 h-5" />
          <span className="text-[10px] uppercase font-black tracking-[0.15em]">AI Context Powered</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Clock className="w-5 h-5" />
          <span className="text-[10px] uppercase font-black tracking-[0.15em]">~15 Min Session</span>
        </div>
      </div>
    </form>
  );
}
