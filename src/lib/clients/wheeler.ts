import content from './wheeler-clusters.json';

export type ReviewStatus = 'pending' | 'approved' | 'changes' | 'hold';
export interface ReviewDecision { status: ReviewStatus; note: string; updatedAt: string; reviewer?: string }
export interface ClusterIdea { id: string; title: string; description: string }
export interface Cluster {
  key: string; name: string; shortName: string; summary: string; purpose: string;
  audiences: string[]; jobs: string[]; stages: string[]; coverage: string; onHold: boolean;
  editorialNote: string; centralPage: string;
  topics: { id: string; title: string; date: string; status: string; audience: string; format: string; checks: string[] }[];
  possibleTopics: { title: string; rationale: string }[]; exampleTopics: string[];
  existingPages: { title: string; url: string }[];
}
export const workspace: {
  version: string; updated: string; clusters: Cluster[];
} = content;
export const reviewLabels: Record<ReviewStatus, string> = { pending: 'Awaiting review', approved: 'Approved direction', changes: 'Changes requested', hold: 'Kept for later' };

export function buildReviewSummary(decisions: Record<string, ReviewDecision>, reviewer: string, ideas: ClusterIdea[] = []) {
  const lines = ['Wheeler · Content strategy review', `Reviewer: ${reviewer.trim() || 'Stacie Morris'}`, `Strategy version: ${workspace.updated}`, '', 'Review of topic directions; article publication remains a separate step.', ''];
  for (const cluster of workspace.clusters) {
    const decision = decisions[cluster.key];
    lines.push(`${cluster.name}: ${reviewLabels[decision?.status || 'pending']}`);
    if (decision?.note.trim()) lines.push(`Feedback: ${decision.note.trim()}`);
    lines.push('');
  }
  if (ideas.length) {
    lines.push('Suggested cluster ideas', '');
    for (const idea of ideas) {
      lines.push(idea.title);
      if (idea.description.trim()) lines.push(idea.description.trim());
      lines.push('');
    }
  }
  return lines.join('\n');
}
