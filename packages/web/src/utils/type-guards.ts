import { Flashcard } from '@/lib/models';

export function isValidFlashcardArray(data: unknown): data is Flashcard[] {
  return Array.isArray(data) && data.every(card => 
    typeof card === 'object' && 
    card !== null &&
    'question' in card && 
    'answer' in card && 
    'slug' in card);
}