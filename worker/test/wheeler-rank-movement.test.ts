import { describe, expect, it } from 'vitest';
import { rankPosition, rankMovement, metricMovement } from '../../src/lib/clients/wheeler-rank-movement';
import { visibility, engines, competitorCounts, identifiedCount } from '../../src/lib/clients/wheeler-visibility';

describe('competitor rank movement', () => {
 it('shows count and percentage-point changes without floating-point noise', () => {
  expect(metricMovement(47,44).text).toBe('↑ 3');
  expect(metricMovement(47/88*100,44/88*100,'pp').text).toBe('↑ 3.4 pp');
  expect(metricMovement(1/22*100,2/22*100,'pp').text).toBe('↓ 4.5 pp');
  expect(metricMovement(24,24).text).toBe('—');
 });
 it('shares ranks for ties and leaves zero mentions unranked', () => {
  expect(rankPosition(24, [47,30,27,24,16,16])).toBe(4);
  expect(rankPosition(16, [47,30,27,24,16,16])).toBe(5);
  expect(rankPosition(0, [0,0])).toBeNull();
 });
 it('distinguishes rising, falling, unchanged and newly mentioned brands', () => {
  expect(rankMovement(2,5).text).toBe('↑ 3');
  expect(rankMovement(4,3).text).toBe('↓ 1');
  expect(rankMovement(3,3).text).toBe('—');
  expect(rankMovement(5,null).text).toBe('New');
  expect(rankMovement(null,2).text).toBe('—');
 });
 it('compares Wheeler with the entire previous leaderboard for each engine', () => {
  const runs=visibility.runs.slice(-2);
  const ranks=runs.map(run=>rankPosition(identifiedCount(run),[identifiedCount(run),...Object.values(competitorCounts(run))]));
  expect(ranks).toEqual([3,4]);
  expect(rankMovement(ranks[1]!,ranks[0]!).text).toBe('↓ 1');
  for(const engine of engines){
   const ranks=runs.map(run=>rankPosition(run.providers[engine.id].present,[run.providers[engine.id].present,...Object.values(run.competitors[engine.id])]));
   expect(rankMovement(ranks[1]!,ranks[0]!).text).toBeTruthy();
  }
 });
});
