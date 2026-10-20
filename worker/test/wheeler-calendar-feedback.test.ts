import { describe, expect, it } from 'vitest';
import { currentCalendarDecision, calendarFeedbackResetAt } from '../../src/lib/clients/wheeler-calendar-feedback';

describe('calendar question round',()=>{
 const old={status:'changes' as const,note:'Previous feedback',updatedAt:'2026-10-10T12:00:00Z',reviewer:'Stacie Morris'};
 it('clears old feedback and its change request without mutating shared history',()=>{
  expect(currentCalendarDecision(old)).toEqual({...old,note:'',status:'pending'});
  expect(old.note).toBe('Previous feedback');
  expect(currentCalendarDecision({...old,status:'approved'})).toEqual({...old,note:'',status:'approved'});
 });
 it('keeps new answers and future edit requests',()=>{
  const answer={...old,note:'New answer',updatedAt:'2026-10-21T12:00:00Z'};
  expect(currentCalendarDecision(answer)).toBe(answer);
  expect(currentCalendarDecision({...answer,updatedAt:calendarFeedbackResetAt})?.note).toBe('New answer');
  expect(currentCalendarDecision()).toBeUndefined();
 });
});
