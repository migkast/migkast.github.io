// Shared protocol used by the dashboard and its Cloudflare endpoint.
export type SharedReviewStatus = 'pending' | 'approved' | 'changes' | 'hold';
export interface SharedIdea { id: string; title: string; description: string }
export type ReviewChange =
  | { kind: 'decision'; key: string; status: SharedReviewStatus; note: string }
  | { kind: 'idea'; idea: SharedIdea }
  | { kind: 'removeIdea'; id: string };
export interface ReviewOperation { id: string; reviewer: string; change: ReviewChange }
export interface ReviewEvent extends ReviewOperation { savedAt: string }
export interface SharedReviewState {
  decisions: Record<string, { status: SharedReviewStatus; note: string; updatedAt: string; reviewer: string }>;
  ideas: SharedIdea[];
}

export function reduceReview(events: ReviewEvent[]): SharedReviewState {
  const decisions: SharedReviewState['decisions'] = {};
  const ideas = new Map<string, SharedIdea>();
  for (const event of [...events].sort((a, b) => a.savedAt.localeCompare(b.savedAt) || a.id.localeCompare(b.id))) {
    const change = event.change;
    if (change.kind === 'decision') {
      decisions[change.key] = { status: change.status, note: change.note, reviewer: event.reviewer, updatedAt: event.savedAt };
    } else if (change.kind === 'idea') ideas.set(change.idea.id, change.idea);
    else ideas.delete(change.id);
  }
  return { decisions, ideas: [...ideas.values()] };
}
