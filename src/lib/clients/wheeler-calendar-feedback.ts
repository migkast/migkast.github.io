import type { SharedReviewState } from './wheeler-review';
// Start the new question round with a clear calendar. Shared history stays archived.
export const calendarFeedbackResetAt = '2026-10-20T17:07:31Z';
export function currentCalendarDecision(decision?: SharedReviewState['decisions'][string]) {
 if (!decision || Date.parse(decision.updatedAt) >= Date.parse(calendarFeedbackResetAt)) return decision;
 return { ...decision, note: '', status: decision.status === 'changes' ? 'pending' as const : decision.status };
}
