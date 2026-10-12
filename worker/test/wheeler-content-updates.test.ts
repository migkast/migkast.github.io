import { describe, expect, it } from 'vitest';
import { resolvedFeedback } from '../../src/lib/clients/wheeler-content-updates';
const key = 'article:cb7037b6-fc83-4ba2-83f7-d7818667c90c';
const decision = { status:'changes' as const, reviewer:'Stacie Morris', updatedAt:'2026-10-10T00:11:49.629Z', note:"Is the point of this article to compare Wheeler Homes vs Homes with Panelizers and cover insurance, etc? OR is it to specifically address the builders' risk insurance for Wheeler?" };
describe('Wheeler feedback resolution', () => {
 it('answers the addressed feedback without modifying the original note or approval', () => {
  const original = {...decision};
  expect(resolvedFeedback(key,decision)).toContain('Replaced the builders’ risk topic');
  expect(decision).toEqual(original);
 });
 it('leaves new feedback and unrelated feedback unresolved', () => {
  expect(resolvedFeedback(key,{...decision,updatedAt:'2026-10-13T00:00:00Z'})).toBeUndefined();
  expect(resolvedFeedback(key,{...decision,note:'A new request'})).toBeUndefined();
  expect(resolvedFeedback('article:another',decision)).toBeUndefined();
  expect(resolvedFeedback(key)).toBeUndefined();
 });
});
