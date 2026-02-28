import { z } from 'zod';

export const InterviewContextSchema = z.object({
  jobDescription: z.string().min(10, 'Job description must be at least 10 characters'),
  companyBackground: z.string().min(5, 'Company background must be at least 5 characters'),
  questionType: z.enum(['Behavioral', 'Technical', 'Situational', 'Case Study', 'Other']),
});

export const DailyContextSchema = z.object({
  setting: z.string().optional(),
  formality: z.enum(['Casual', 'Neutral', 'Formal']).optional(),
});

export const TranslationSchema = z.object({
  translation: z.string().min(10, 'Translation must be at least 10 characters'),
});

export const SourceTextSchema = z.object({
  sourceText: z.string().min(5, 'Source text must be at least 5 characters'),
});
