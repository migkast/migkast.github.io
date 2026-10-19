// Competition ranking: equal scores share a position and zero mentions are unranked.
export function rankPosition(count: number, scores: number[]): number | null {
  return count > 0 ? 1 + scores.filter(score => score > count).length : null;
}
export function rankMovement(current: number | null, previous: number | null) {
  if (current === null) return { text: '—', direction: 'same', label: 'No mentions in this test' };
  if (previous === null) return { text: 'New', direction: 'new', label: 'Not mentioned in the previous test' };
  const change = previous - current;
  return { text: change > 0 ? `↑ ${change}` : change < 0 ? `↓ ${-change}` : '—', direction: change > 0 ? 'up' : change < 0 ? 'down' : 'same', label: change ? `Moved ${change > 0 ? 'up' : 'down'} ${Math.abs(change)} ${Math.abs(change) === 1 ? 'place' : 'places'} since the previous test` : 'Rank unchanged since the previous test' };
}
