import { articles } from './wheeler-calendar.json';
export const maxAnswerLength = 20000;
// Editorial wording changes can retain their existing answer keys. New questions use a text hash.
export function calendarQuestionKey(article: { id: string; questionSourceArticleId?: string; questionKeyOverrides?: Record<string, string | undefined> }, question: string) {
 const existingKey = article.questionKeyOverrides?.[question];
 if (existingKey) return existingKey;
 let hash = 2166136261;
 for (let index = 0; index < question.length; index++) hash = Math.imul(hash ^ question.charCodeAt(index), 16777619);
 return `article:${article.questionSourceArticleId || article.id}:question:${(hash >>> 0).toString(16)}`;
}
export const calendarQuestionKeys = new Set(articles.flatMap(article => article.questionsForWheeler.map(question => calendarQuestionKey(article, question))));
