// spec: 001-database  AC-3.1, AC-4.1–4.3, AC-5.1–5.3
// Note: mock storage will be replaced with real API calls in T-20.
import { Flashcard } from "@/lib/types";
import { applyRating } from "@/lib/sm2";

// Mock storage for demo
let mockFlashcards: Flashcard[] = [];

export async function saveFlashcards(cards: Omit<Flashcard, 'id' | 'createdAt' | 'interval' | 'easeFactor' | 'nextReviewDate'>[]): Promise<void> {
  const newCards = cards.map(card => ({
    ...card,
    id: Math.random().toString(36).substring(7),
    createdAt: new Date().toISOString(),
    interval: 0,
    easeFactor: 2.5,
    nextReviewDate: new Date().toISOString(),
  }));
  mockFlashcards = [...mockFlashcards, ...newCards];
}

export async function getDueFlashcards(): Promise<Flashcard[]> {
  const now = new Date();
  return mockFlashcards.filter(card => new Date(card.nextReviewDate) <= now);
}

export async function updateFlashcard(id: string, rating: number): Promise<void> {
  const cardIndex = mockFlashcards.findIndex(c => c.id === id);
  if (cardIndex === -1) return;

  const card = mockFlashcards[cardIndex];
  const { interval, easeFactor, nextReviewDate } = applyRating(
    rating,
    card.interval,
    card.easeFactor,
    0, // repetitions not tracked in mock shape; T-20 will wire real state
  );

  mockFlashcards[cardIndex] = {
    ...card,
    interval,
    easeFactor,
    nextReviewDate: nextReviewDate.toISOString(),
  };
}
