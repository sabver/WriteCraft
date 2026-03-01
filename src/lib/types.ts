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

// ─── DB-aligned types (spec: 001-database  plan §5.4) ─────────────────────────

// Prisma enum strings (uppercase)
export type SceneTypeDB = 'INTERVIEW' | 'DAILY'
export type IssueTypeDB = 'GRAMMAR' | 'WORD_CHOICE' | 'STRUCTURE'
export type SeverityDB = 'HIGH' | 'MEDIUM' | 'LOW'
export type FlashcardModeDB = 'PARAGRAPH' | 'SENTENCE'

// POST /api/sessions
export interface CreateSessionInput {
  scene: SceneTypeDB
  context: Record<string, string>
  sourceText: string
  userTranslation: string
  aiReference: string
  issues: Array<{
    type: IssueTypeDB
    title: string
    original: string
    revised: string
    reason: string
    severity: SeverityDB
    sortOrder: number
  }>
}

// GET /api/sessions — list item
export interface SessionListItem {
  id: string
  scene: SceneTypeDB
  context: Record<string, string>
  sourceText: string
  userTranslation: string
  issueCount: number
  createdAt: string
}

// GET /api/sessions/[id] — full detail
export interface SessionDetail {
  id: string
  scene: SceneTypeDB
  context: Record<string, string>
  sourceText: string
  userTranslation: string
  aiReference: string
  createdAt: string
  issues: ReviewIssue[]
  flashcardIds: string[]
}

// POST /api/flashcards
export interface SaveFlashcardsInput {
  sessionId: string
  mode: FlashcardModeDB
  scene: SceneTypeDB
  context: Record<string, string>
  cards: Array<{
    front: string
    backUserTranslation: string
    backAiRevision: string
    backFeedbackSummary: string[]
  }>
}
