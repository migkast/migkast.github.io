import { currentCalendarDecision } from './wheeler-calendar-feedback';
import type { ReviewChange, SharedReviewState } from './wheeler-review';
import type { SyncStatus } from './wheeler-review-sync';
export function initCalendarReview(queue: (change: ReviewChange) => void, pending: (key: string) => boolean, retry: () => void) {
 const rows = Array.from(document.querySelectorAll<HTMLElement>('[data-calendar-key]'));
 let decisions: SharedReviewState['decisions'] = {};
 const openEditor = (row: HTMLElement) => {
  const form = row.querySelector<HTMLFormElement>('form')!;
  form.hidden = false;
  const note = form.querySelector<HTMLTextAreaElement>('textarea')!;
  if (!note.value) note.value = decisions[row.dataset.calendarKey!]?.note || '';
  note.focus();
 };
 const approve = (row: HTMLElement) => queue({kind:'decision',key:row.dataset.calendarKey!,status:'approved',note:decisions[row.dataset.calendarKey!]?.note || ''});
 rows.forEach(row => {
  row.querySelector('[data-topic-approve]')!.addEventListener('click', () => {
   if (decisions[row.dataset.calendarKey!]?.status === 'changes') openEditor(row);
   else approve(row);
  });
  row.querySelector('[data-topic-reapprove]')!.addEventListener('click', () => approve(row));
  row.querySelector('[data-topic-feedback]')!.addEventListener('click', () => openEditor(row));
  row.querySelector('[data-topic-cancel]')!.addEventListener('click', () => {
   row.querySelector<HTMLFormElement>('form')!.hidden = true;
   row.querySelector<HTMLTextAreaElement>('.topic-feedback-form textarea')!.value = decisions[row.dataset.calendarKey!]?.note || '';
   row.querySelector<HTMLButtonElement>('[data-topic-feedback]')!.focus();
  });
  row.querySelector('form')!.addEventListener('submit', event => {
   event.preventDefault();
   const note = row.querySelector<HTMLTextAreaElement>('.topic-feedback-form textarea')!;
   const error = row.querySelector<HTMLElement>('[data-topic-error]')!;
   error.hidden = !!note.value.trim();
   if (!note.value.trim()) { note.focus(); return; }
   queue({kind:'decision',key:row.dataset.calendarKey!,status:'changes',note:note.value.trim()});
   row.querySelector<HTMLFormElement>('form')!.hidden = true;
  });
 });
 document.querySelector('[data-calendar-retry]')!.addEventListener('click',retry);
 return {
  render(state: SharedReviewState) {
   decisions = Object.fromEntries(Object.entries(state.decisions).map(([key,decision])=>[key,currentCalendarDecision(decision)!]));
   let reviewed = 0;
   rows.forEach(row => {
    const key = row.dataset.calendarKey!; const decision = decisions[key]; const status = decision?.status || 'pending';
    if (status !== 'pending') reviewed++;
    const badge = row.querySelector<HTMLElement>('[data-topic-status]')!;
    const answer: string | undefined = undefined;
    const feedbackLabel = row.querySelector<HTMLElement>('[data-feedback-resolved]')!;
    feedbackLabel.hidden = !answer;
    feedbackLabel.textContent = '';
    row.querySelector<HTMLElement>('[data-feedback-answer]')!.hidden = !answer;
    row.querySelector<HTMLElement>('[data-feedback-answer-text]')!.textContent = answer || '';
    badge.dataset.state = status;
    badge.hidden = status === 'pending' && row.dataset.hasDraft === 'true' && !pending(key);
    const gridStatus = document.querySelector<HTMLElement>(`[data-grid-topic-status="${key}"]`);
    if (gridStatus) gridStatus.textContent = answer && status === 'changes' ? 'Updated · review revision' : status === 'approved' ? 'Approved' : status === 'changes' ? 'Changes requested' : 'Awaiting review';
    badge.textContent = (answer && status === 'changes' ? 'Updated · review revision' : status === 'approved' ? 'Approved' : status === 'changes' ? 'Changes requested' : 'Awaiting review') + (pending(key) ? ' · saving…' : '');
    const button = row.querySelector<HTMLButtonElement>('[data-topic-approve]')!;
    button.textContent = status === 'changes' ? 'Review changes' : status === 'approved' ? 'Approved' : 'Approve topic';
    button.disabled = status === 'approved' || pending(key);
    row.querySelector<HTMLElement>('[data-topic-reapprove]')!.hidden = status !== 'changes';
    row.querySelector<HTMLElement>('[data-topic-feedback]')!.textContent = decision?.note ? 'Edit feedback' : 'Add feedback';
    row.querySelector<HTMLElement>('.topic-saved-feedback')!.hidden = !decision?.note;
    row.querySelector<HTMLElement>('[data-topic-note]')!.textContent = decision?.note || '';
    row.querySelector<HTMLElement>('[data-topic-meta]')!.textContent = decision ? `${decision.reviewer} · ${new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/Lisbon',day:'numeric',month:'short',hour:'2-digit',minute:'2-digit'}).format(new Date(decision.updatedAt))}` : '';
   });
   document.querySelector('#calendar-review-progress')!.textContent = `${reviewed} of ${rows.length} reviewed`;
  },
  status(status: SyncStatus) {
   const message = document.querySelector<HTMLElement>('[data-calendar-sync]')!;
   message.parentElement!.hidden = status !== 'offline' && status !== 'saving' && status !== 'unconfigured';
   message.textContent = status === 'offline' ? 'Unable to save to the shared workspace. Retry when connected; pending decisions are not yet shared.' : status === 'saving' ? 'Saving your decision…' : 'Shared approvals are unavailable.';
   document.querySelector<HTMLElement>('[data-calendar-retry]')!.hidden = status !== 'offline';
  }
 };
}
