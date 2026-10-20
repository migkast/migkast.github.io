import { describe, expect, it } from 'vitest';
import { visibility, engines, identifiedCount, competitorCounts, percentage } from '../../src/lib/clients/wheeler-visibility';
describe('Wheeler AI visibility snapshots',()=>{
 it('uses provider-specific presence scores across all three tests',()=>{
  expect(visibility.runs.map(identifiedCount)).toEqual([4,24,24]);
  expect(engines.map(e=>visibility.runs[1]!.providers[e.id].present)).toEqual([2,1,0,21]);
  expect(engines.map(e=>visibility.runs[2]!.providers[e.id].present)).toEqual([1,1,0,22]);
  expect(visibility.runs[2]!.startedAt).toContain('2026-10-19');
  expect(percentage(24,88)).toBe(27.3);
 });
 it('retains only the latest 22 prompts and all 88 current answers',()=>{
  expect(visibility.latestPrompts).toHaveLength(22);
  expect(new Set(visibility.latestPrompts.map(p=>p.prompt)).size).toBe(22);
  expect(visibility.latestPrompts.every(p=>p.recordedAt.startsWith('2026-10-19'))).toBe(true);
  expect(visibility.latestPrompts.every(p=>engines.every(e=>p.results[e.id].answer.length>0))).toBe(true);
  expect(visibility.latestPrompts.every(p=>engines.every(e=>p.results[e.id].appears===(p.results[e.id].identity.verdict==='present')))).toBe(true);
  expect(visibility.comparison.samePromptCount).toBe(22);
 });
 it('counts competing names per answer without merging aliases',()=>{
  expect(competitorCounts(visibility.runs[0]!)['ESRL Development']).toBe(7);
  expect(competitorCounts(visibility.runs[1]!)['ESRL Development']).toBe(44);
  expect(competitorCounts(visibility.runs[1]!)['Cal Steel Group']).toBe(29);
  expect(competitorCounts(visibility.runs[2]!)['ESRL Development']).toBe(47);
 });
});
