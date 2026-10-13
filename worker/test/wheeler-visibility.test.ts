import { describe, expect, it } from 'vitest';
import { visibility, engines, identifiedCount, competitorCounts, percentage } from '../../src/lib/clients/wheeler-visibility';
describe('Wheeler AI visibility snapshots',()=>{
 it('uses provider-specific presence scores across both tests',()=>{
  expect(visibility.runs.map(identifiedCount)).toEqual([4,24]);
  expect(engines.map(e=>visibility.runs[1].providers[e.id].present)).toEqual([2,1,0,21]);
  expect(percentage(24,88)).toBe(27.3);
 });
 it('retains only the latest 22 prompts and all 88 current answers',()=>{
  expect(visibility.latestPrompts).toHaveLength(22);
  expect(visibility.latestPrompts.every(p=>engines.every(e=>p.results[e.id].answer.length>0))).toBe(true);
  expect(visibility.latestPrompts.every(p=>engines.every(e=>p.results[e.id].appears===(p.results[e.id].identity.verdict==='present')))).toBe(true);
  expect(visibility.comparison.samePromptCount).toBe(2);
 });
 it('counts competing names per answer without merging aliases',()=>{
  expect(competitorCounts(visibility.runs[0])['ESRL Development']).toBe(7);
  expect(competitorCounts(visibility.runs[1])['ESRL Development']).toBe(44);
  expect(competitorCounts(visibility.runs[1])['Cal Steel Group']).toBe(29);
 });
});
