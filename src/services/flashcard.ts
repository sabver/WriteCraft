import { Flashcard } from "@/lib/types";

// SM-2 Algorithm Implementation
export function calculateNextReview(rating: number, previousInterval: number, previousEase: number): { interval: number, ease: number, nextDate: string } {
  let interval: number;
  let ease = previousEase;

  if (rating >= 3) {
    if (previousInterval === 0) {
      interval = 1;
    } else if (previousInterval === 1) {
      interval = 6;
    } else {
      interval = Math.round(previousInterval * ease);
    }
    ease = Math.max(1.3, ease + (0.1 - (5 - rating) * (0.08 + (5 - rating) * 0.02)));
  } else {
    interval = 1;
    ease = Math.max(1.3, ease - 0.2);
  }

  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);

  return {
    interval,
    ease,
    nextDate: nextDate.toISOString(),
  };
}

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
  const { interval, ease, nextDate } = calculateNextReview(rating, card.interval, card.easeFactor);

  mockFlashcards[cardIndex] = {
    ...card,
    interval,
    easeFactor: ease,
    nextReviewDate: nextDate,
  };
}
