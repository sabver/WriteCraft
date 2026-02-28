import { z } from 'zod';

export type SceneType = 'interview' | 'daily';

export interface ContextField {
  label: string;
  value: string;
  required: boolean;
}

export interface TranslationSession {
  id: string;
  scene: SceneType;
  context: Record<string, string>;
  sourceText: string;
  userTranslation: string;
  aiReference: string;
  feedback: ReviewIssue[];
  createdAt: string;
}

export type IssueType = 'grammar' | 'word-choice' | 'structure';

export interface ReviewIssue {
  id: string;
  type: IssueType;
  title: string;
  original: string;
  revised: string;
  reason: string;
  severity: 'high' | 'medium' | 'low';
}

export interface Flashcard {
  id: string;
  sessionId: string;
  front: string;
  back: {
    userTranslation: string;
    aiRevision: string;
    feedbackSummary: string[];
  };
  scene: SceneType;
  context: Record<string, string>;
  interval: number;
  easeFactor: number;
  nextReviewDate: string;
  createdAt: string;
}

export interface HistoryFilter {
  scene?: SceneType | 'all';
  range?: '7d' | '30d' | 'all';
  q?: string;
}
