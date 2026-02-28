'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressStepperProps {
  steps: string[];
  currentStep: number;
}

export function ProgressStepper({ steps, currentStep }: ProgressStepperProps) {
  return (
    <div className="w-full py-8 px-4">
      <div className="relative flex items-center justify-between">
        {/* Background Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-slate-200 z-0" />
        
        {/* Active Progress Line */}
        <div 
          className="absolute top-5 left-0 h-0.5 bg-primary z-0 transition-all duration-500 ease-in-out"
          style={{ 
            width: `${(currentStep / (steps.length - 1)) * 100}%` 
          }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          
          return (
            <div 
              key={step} 
              className="flex flex-col items-center relative z-10"
            >
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                isCompleted ? "bg-primary border-primary text-white" : 
                isActive ? "bg-white border-primary text-primary shadow-lg shadow-primary/20" : 
                "bg-white border-slate-200 text-slate-400"
              )}>
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-bold">{index + 1}</span>
                )}
              </div>
              
              <div className="absolute top-12 whitespace-nowrap left-1/2 -translate-x-1/2">
                <span className={cn(
                  "text-[10px] font-black uppercase tracking-widest",
                  isActive ? "text-primary" : "text-slate-400"
                )}>
                  {step}
                </span>
              </div>
            </div>
          );
        })}
      </div>
      {/* Spacer for absolute labels */}
      <div className="h-8" />
    </div>
  );
}
