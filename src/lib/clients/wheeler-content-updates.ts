import type { SharedReviewState } from './wheeler-review';

export const updatedClusters = new Set(['steel-framing-quote-comparison']);
export const updatedArticles = new Set([
 'cb7037b6-fc83-4ba2-83f7-d7818667c90c',
 '8f9d5066-638d-436e-9757-91ff87f11cf4'
]);
const responses: Record<string, { note: string; through: string; answer: string }> = {
 'article:cb7037b6-fc83-4ba2-83f7-d7818667c90c': {
  note: "Is the point of this article to compare Wheeler Homes vs Homes with Panelizers and cover insurance, etc? OR is it to specifically address the builders' risk insurance for Wheeler?",
  through: '2026-10-10T00:11:49.629Z',
  answer: 'Replaced the builders’ risk topic with a homeowner-focused article about how fire-resistive home construction can affect insurance costs. November 18 now focuses on comparing actual insurance quotes on equivalent terms, so the two articles have different purposes.'
 }
};
// Resolve only the feedback addressed by this revision. Later feedback stays open.
export function resolvedFeedback(key: string, decision?: SharedReviewState['decisions'][string]) {
 const response = responses[key];
 return response && decision && decision.note === response.note && decision.updatedAt <= response.through ? response.answer : undefined;
}
