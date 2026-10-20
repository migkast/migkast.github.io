import { describe, expect, it } from 'vitest';
import report from '../../src/lib/clients/wheeler-opportunity.json';
import { articles } from '../../src/lib/clients/wheeler-calendar.json';
import { calendarQuestionKey } from '../../src/lib/clients/wheeler-calendar-questions';

describe('October 20 calendar and opportunity import',()=>{
 it('keeps the saved schedule, unique identities and two-topic weekly cadence',()=>{
  expect(articles).toHaveLength(35);expect(new Set(articles.map(a=>a.id)).size).toBe(35);
  expect(articles[0]!.scheduledDate).toBe('2026-10-20');expect(articles.at(-1)!.scheduledDate).toBe('2027-02-16');
  const weeks:Record<string,number>={};
  for(const article of articles){const date=new Date(`${article.scheduledDate}T12:00:00Z`);date.setUTCDate(date.getUTCDate()-(date.getUTCDay()+6)%7);const key=date.toISOString().slice(0,10);weeks[key]=(weeks[key]||0)+1;}
  expect(Math.max(...Object.values(weeks))).toBe(2);
  expect(articles.find(a=>a.id==='63066716-0d0f-458c-ba18-a702c1681c4a')!.scheduledDate).toBe('2026-12-08');
  expect(articles.filter(a=>a.documentUrl)).toHaveLength(2);
 });
 it('preserves the shared answer key despite new dates and distinguishes the optional follow-up',()=>{
  const cost=articles.find(a=>a.id==='8ba5c5fd-cfaa-4882-b8b1-277490fd59b2')!,finish=articles.find(a=>a.id==='4efec579-2af8-43dd-a5df-e970ae5e91fd')!;
  expect(calendarQuestionKey(cost,cost.questionsForWheeler[0]!)).toBe(calendarQuestionKey(finish,finish.questionsForWheeler[0]!));
  expect(articles.flatMap(a=>a.optionalQuestionIndexes)).toHaveLength(1);
  expect(articles.reduce((total,a)=>total+a.questionsForWheeler.length,0)).toBe(44); // 43 supplied questions + shared question displayed once more.
 });
 it('marks confirmed brief coverage without promoting unfinished drafts',()=>{
  const coverage=new Map(report.topics.flatMap(topic=>topic.briefCoverage.map(article=>[article.articleId,article.status] as const)));
  expect([...coverage.values()].filter(status=>status==='brief updated')).toHaveLength(12);
  expect([...coverage.values()].filter(status=>status==='already covered; unchanged')).toHaveLength(10);
  for(const topic of report.topics){expect(topic.briefCoverage).toHaveLength(topic.calendar_articles.length);for(const article of topic.briefCoverage)expect(articles.some(item=>item.id===article.articleId)).toBe(true);}
  expect(articles.find(a=>a.id==='b35e5a60-6923-4dbc-9c43-7c3f7d01f774')!.calendarStatus).toBe('planned');
  expect(report.topics.find(topic=>topic.scenario_id==='R15')!.proposed_article_value).not.toContain('Bring the existing calendar article forward');
 });
 it('keeps observations, repeats and search-demand estimates distinct',()=>{
  expect(report.topics).toHaveLength(20);
  expect(report.chatgpt.filter(a=>!a.scenario_id.startsWith('X'))).toHaveLength(26);
  expect(report.chatgpt.filter(a=>a.scenario_id.startsWith('X'))).toHaveLength(4);
  expect(report.perplexity.filter(a=>a.status==='answer_captured')).toHaveLength(19);
  expect(report.metrics.usable_core_ai_observations).toBe(45);
  expect(report.keywords).toHaveLength(119);
  expect(report.keywords.filter(k=>k.monthlySearches!==null)).toHaveLength(30);
  expect(report.keywords.filter(k=>k.originalScenarios.length&&k.monthlySearches!==null)).toHaveLength(3);
  expect(new Set(report.topics.flatMap(t=>t.calendar_articles.map(a=>a.article_id))).size).toBe(22);
 });
 it('keeps priorities aligned with saved calendar dates and references valid public sources',()=>{
  for(const priority of report.priorities){const article=articles.find(a=>a.id===priority.article_id)!;expect(priority.current_publication_date).toBe(article.scheduledDate);expect(priority.title).toBe(article.title);}
  const ids=new Set(report.sources.map(source=>source.id));
  for(const topic of report.topics)for(const id of topic.source_ids)expect(ids.has(id)).toBe(true);
  for(const source of report.sources)expect(new URL(source.url).protocol).toMatch(/^https?:$/);
  const otherWheeler=report.sources.find(s=>s.id==='S35')!;expect(otherWheeler.category).toBe('Construction business');expect(otherWheeler.relevance).not.toContain('Don Wheeler');
 });
});
