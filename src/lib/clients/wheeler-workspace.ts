import { workspace, reviewLabels, type ReviewDecision, type ReviewStatus, type ClusterIdea } from './wheeler';

const storageKey = `wheeler-workspace-review-${workspace.version}`;
import { WheelerReviewSync, type SyncStatus } from './wheeler-review-sync';
import type { ReviewChange } from './wheeler-review';
let sync: WheelerReviewSync;
const gate = document.querySelector<HTMLElement>('#workspace-gate')!;
const content = document.querySelector<HTMLElement>('#workspace-content')!;
const password = document.querySelector<HTMLInputElement>('#workspace-password')!;
const passwordError = document.querySelector<HTMLElement>('#password-error')!;
const saveStatus = document.querySelector<HTMLElement>('#save-status')!;
const reviewer = document.querySelector<HTMLInputElement>('#workspace-reviewer')!;
const decisions: Record<string, ReviewDecision> = {};
const ideas: ClusterIdea[] = [];
let editingIdeaId: string | undefined;
let removedIdea: { idea: ClusterIdea; index: number } | undefined;

const unlock = (focus = false) => {
  gate.hidden = true;
  content.hidden = false;
  if (focus) document.querySelector<HTMLElement>('#workspace-main')?.focus({ preventScroll: true });
};
document.querySelector('#workspace-unlock')!.addEventListener('submit', async event => {
  event.preventDefault();
  const button = document.querySelector<HTMLButtonElement>('#workspace-unlock button')!;
  button.disabled = true;
  button.textContent = 'Opening workspace…';
  passwordError.textContent = '';
  try {
    reviewer.value = reviewer.value.trim() || 'Stacie Morris';
    save();
    await sync.login(password.value);
    password.removeAttribute('aria-invalid');
    password.value = '';
    unlock(true);
  } catch (error) {
    passwordError.textContent = error instanceof Error && error.name !== 'TypeError' ? error.message : 'Could not connect. Please check your connection and retry.';
    password.setAttribute('aria-invalid', 'true');
  } finally { button.disabled = false; button.textContent = 'Open workspace ↗'; }
});
document.querySelector('#workspace-lock')!.addEventListener('click', () => {
  sync.lock();
  content.hidden = true;
  gate.hidden = false;
  password.value = '';
  window.scrollTo(0, 0);
  if (window.matchMedia('(pointer: fine)').matches) password.focus();
});

try {
  const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
  if (saved && typeof saved === 'object') {
    if (typeof saved.reviewer === 'string') reviewer.value = saved.reviewer.slice(0, 100);

  }
} catch { /* Browser persistence is optional; shared saving remains available. */ }

const tabs = Array.from(document.querySelectorAll<HTMLButtonElement>('.workspace-tabs [role="tab"]'));
function selectTab(tab: HTMLButtonElement) {
  tabs.forEach(item => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')!)!.hidden = !active;
  });
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', event => {
    let next: number;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = tabs.length - 1;
    else return;
    event.preventDefault();
    selectTab(tabs[next]);
    tabs[next].focus();
  });
});

let selectedCluster = workspace.clusters[0]?.key || '';
const clusterButtons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-select-cluster]'));
const statusFor = (key: string): ReviewStatus => decisions[key]?.status || 'pending';

function showSelectedCluster() {
  clusterButtons.forEach(button => {
    const active = button.dataset.selectCluster === selectedCluster;
    button.classList.toggle('selected', active);
    button.setAttribute('aria-pressed', String(active));
  });
  document.querySelectorAll<HTMLElement>('[data-cluster]').forEach(detail => { detail.hidden = detail.dataset.cluster !== selectedCluster; });
}
function selectCluster(key: string) {
  selectedCluster = key;
  showSelectedCluster();
  if (window.matchMedia('(max-width: 900px)').matches) {
    const heading = document.getElementById(`heading-${key}`)!;
    heading.scrollIntoView({ block: 'start' });
    heading.focus({ preventScroll: true });
  }
}
function nextPending(key: string) {
  const index = workspace.clusters.findIndex(cluster => cluster.key === key);
  const ordered = [...workspace.clusters.slice(index + 1), ...workspace.clusters.slice(0, index)];
  return ordered.find(cluster => statusFor(cluster.key) === 'pending');
}
document.querySelectorAll<HTMLButtonElement>('[data-select-cluster]').forEach(button => {
  button.addEventListener('click', () => selectCluster(button.dataset.selectCluster!));
});
document.querySelectorAll<HTMLButtonElement>('[data-go-cluster]').forEach(button => {
  button.addEventListener('click', () => {
    const key = button.dataset.goCluster!;
    selectCluster(key);
    const heading = document.getElementById(`heading-${key}`)!;
    heading.scrollIntoView({ block: 'start' });
    heading.focus({ preventScroll: true });
  });
});

function save(change?: ReviewChange) {
  try {
    localStorage.setItem(storageKey, JSON.stringify({ reviewer: reviewer.value, decisions, ideas }));
  } catch { /* Browser persistence is optional; shared saving remains available. */ }
  if (change) sync.queue(change, reviewer.value);
}

function update() {
  const counts: Record<ReviewStatus, number> = { pending: 0, approved: 0, changes: 0, hold: 0 };
  const metaLabels: Record<ReviewStatus, string> = { pending: 'Review reopened by', approved: 'Approved by', changes: 'Changes requested by', hold: 'Kept for later by' };
  for (const cluster of workspace.clusters) {
    const decision = decisions[cluster.key];
    const status = statusFor(cluster.key);
    counts[status]++;
    const detail = document.getElementById(`cluster-${cluster.key}`)!;
    const badge = document.querySelector<HTMLElement>(`[data-status-for="${cluster.key}"]`)!;
    badge.textContent = reviewLabels[status];
    badge.dataset.state = status;
    const statusLabel = detail.querySelector<HTMLElement>('[data-decision-status]')!;
    statusLabel.textContent = `${reviewLabels[status]}${sync.hasPendingDecision(cluster.key) ? ' · waiting to save' : ''}`;
    statusLabel.dataset.state = status;
    detail.querySelector<HTMLButtonElement>('.approve-button')!.setAttribute('aria-pressed', String(status === 'approved'));
    detail.querySelector<HTMLButtonElement>('[data-action="hold"]')!.setAttribute('aria-pressed', String(status === 'hold'));
    detail.querySelector<HTMLButtonElement>('[data-action="pending"]')!.hidden = status === 'pending';
    const note = detail.querySelector<HTMLElement>('[data-decision-note]')!;
    note.textContent = decision?.note || '';
    detail.querySelector<HTMLElement>('[data-saved-feedback]')!.hidden = !decision?.note;
    const meta = detail.querySelector<HTMLElement>('[data-decision-meta]')!;
    meta.hidden = !decision?.reviewer;
    meta.textContent = decision?.reviewer ? `${metaLabels[status]} ${decision.reviewer} · ${new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).format(new Date(decision.updatedAt))}` : '';
    detail.querySelector<HTMLButtonElement>('[data-open-feedback]')!.textContent = decision?.note ? 'Edit feedback' : 'Request changes';
    detail.querySelector<HTMLElement>('[data-next-pending]')!.hidden = status === 'pending' || !nextPending(cluster.key);
  }
  document.querySelector('#review-progress')!.textContent = `${workspace.clusters.length - counts.pending} of ${workspace.clusters.length} reviewed`;
  document.querySelector<HTMLElement>('#progress-fill')!.style.width = `${(workspace.clusters.length - counts.pending) / workspace.clusters.length * 100}%`;
  showSelectedCluster();
}

const ideasForm = document.querySelector<HTMLFormElement>('#cluster-ideas-form')!;
const ideaTitle = document.querySelector<HTMLInputElement>('#idea-title')!;
const ideaDescription = document.querySelector<HTMLTextAreaElement>('#idea-description')!;
const ideaStatus = document.querySelector<HTMLElement>('#idea-save-status')!;
function setIdeasForm(open: boolean) {
  ideasForm.hidden = !open;
  document.querySelectorAll<HTMLElement>('[data-open-ideas]').forEach(button => button.setAttribute('aria-expanded', String(open)));
}
function renderIdeas() {
  const list = document.querySelector<HTMLUListElement>('#cluster-idea-list')!;
  list.replaceChildren();
  list.hidden = ideas.length === 0;
  document.querySelector('#idea-count')!.textContent = `${ideas.length} suggestion${ideas.length === 1 ? '' : 's'}`;
  for (const idea of ideas) {
    const item = document.createElement('li');
    const copy = document.createElement('div');
    const heading = document.createElement('h3');
    heading.textContent = idea.title;
    copy.append(heading);
    if (idea.description) {
      const description = document.createElement('p');
      description.textContent = idea.description;
      copy.append(description);
    }
    const edit = document.createElement('button');
    edit.type = 'button';
    edit.textContent = 'Edit';
    edit.setAttribute('aria-label', `Edit idea: ${idea.title}`);
    edit.addEventListener('click', () => {
      editingIdeaId = idea.id;
      ideaTitle.value = idea.title;
      ideaDescription.value = idea.description;
      document.querySelector('#save-idea')!.textContent = 'Save changes';
      setIdeasForm(true);
      ideasForm.scrollIntoView({ block: 'center' });
      if (window.matchMedia('(pointer: fine)').matches) ideaTitle.focus({ preventScroll: true });
    });
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.textContent = 'Remove';
    remove.className = 'text-button';
    remove.setAttribute('aria-label', `Remove idea: ${idea.title}`);
    remove.addEventListener('click', () => {
      const index = ideas.findIndex(value => value.id === idea.id);
      removedIdea = { idea, index };
      ideas.splice(index,1);
      if (editingIdeaId === idea.id) { editingIdeaId = undefined; setIdeasForm(false); }
      save({ kind: 'removeIdea', id: idea.id }); renderIdeas(); update();
      ideaStatus.textContent = 'Idea removed. You can undo this below; the change will be shared.';
      document.querySelector<HTMLElement>('#undo-idea-removal')!.hidden = false;
      document.querySelector<HTMLButtonElement>('#undo-idea-removal')!.focus({ preventScroll: true });
    });
    const actions = document.createElement('div');
    actions.className = 'idea-item-actions';
    actions.append(edit, remove);
    item.append(copy,actions);
    list.append(item);
  }
}
document.querySelectorAll<HTMLButtonElement>('[data-open-ideas]').forEach(button => {
  button.addEventListener('click', () => {
    selectTab(tabs[0]);
    editingIdeaId = undefined;
    ideasForm.reset();
    document.querySelector('#save-idea')!.textContent = 'Save cluster idea';
    setIdeasForm(true);
    ideasForm.scrollIntoView({ block: 'center' });
    if (window.matchMedia('(pointer: fine)').matches) ideaTitle.focus({ preventScroll: true });
  });
});
document.querySelector('#undo-idea-removal')!.addEventListener('click', () => {
  if (!removedIdea) return;
  const restored = removedIdea.idea;
  ideas.splice(removedIdea.index,0,restored);
  removedIdea = undefined;
  save({ kind: 'idea', idea: restored }); renderIdeas(); update();
  document.querySelector<HTMLElement>('#undo-idea-removal')!.hidden = true;
  ideaStatus.textContent = 'Idea restored.';
  document.querySelector<HTMLButtonElement>('.suggest-cluster')!.focus({ preventScroll: true });
});
document.querySelector('#cancel-idea')!.addEventListener('click', () => {
  setIdeasForm(false);
  document.querySelector<HTMLElement>('.suggest-cluster')!.focus({ preventScroll: true });
});
ideasForm.addEventListener('submit', event => {
  event.preventDefault();
  const error = document.querySelector<HTMLElement>('#idea-error')!;
  if (!ideaTitle.value.trim()) {
    error.textContent = 'Please give your cluster idea a name.';
    ideaTitle.setAttribute('aria-invalid','true');
    ideaTitle.focus();
    return;
  }
  error.textContent = '';
  ideaTitle.removeAttribute('aria-invalid');
  const idea: ClusterIdea = { id: editingIdeaId || crypto.randomUUID(), title: ideaTitle.value.trim(), description: ideaDescription.value.trim() };
  const index = ideas.findIndex(item => item.id === editingIdeaId);
  if (index >= 0) ideas[index] = idea;
  else ideas.push(idea);
  save({ kind: 'idea', idea });
  renderIdeas();
  update();
  setIdeasForm(false);
  ideaStatus.textContent = index >= 0 ? 'Idea updated.' : 'Idea added.';
  document.querySelector<HTMLButtonElement>('.suggest-cluster')!.focus({ preventScroll: true });
});
document.querySelector('[data-back-to-clusters]')!.addEventListener('click', () => {
  selectTab(tabs[0]);
  tabs[0].focus();
});

document.querySelectorAll<HTMLElement>('[data-cluster]').forEach(detail => {
  const key = detail.dataset.cluster!;
  const editor = detail.querySelector<HTMLElement>('.feedback-editor')!;
  const trigger = detail.querySelector<HTMLButtonElement>('[data-open-feedback]')!;
  const note = detail.querySelector<HTMLTextAreaElement>('textarea')!;
  note.addEventListener('input', () => { note.dataset.dirty = 'true'; });
  note.value = decisions[key]?.note || '';
  if (decisions[key]?.status === 'changes') { editor.hidden = false; trigger.setAttribute('aria-expanded', 'true'); }
  detail.querySelectorAll<HTMLButtonElement>('[data-action]').forEach(button => {
    button.addEventListener('click', () => {
      const status = button.dataset.action as ReviewStatus;
      decisions[key] = { status, note: decisions[key]?.note || '', updatedAt: new Date().toISOString() };
      if (status === 'pending') {
        note.dataset.dirty = '';
        editor.hidden = true;
        trigger.setAttribute('aria-expanded', 'false');
      }
      save({ kind: 'decision', key, status, note: decisions[key]!.note });
      editor.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      update();
      if (status === 'pending') detail.querySelector<HTMLButtonElement>('.approve-button')!.focus({ preventScroll: true });
    });
  });
  trigger.addEventListener('click', () => {
    editor.hidden = !editor.hidden;
    trigger.setAttribute('aria-expanded', String(!editor.hidden));
    if (!editor.hidden && window.matchMedia('(pointer: fine)').matches) note.focus();
  });
  detail.querySelector('[data-save-feedback]')!.addEventListener('click', () => {
    const error = detail.querySelector<HTMLElement>('.field-error')!;
    if (!note.value.trim()) {
      error.textContent = 'Please add a note so Miguel knows what to change.';
      note.setAttribute('aria-invalid', 'true');
      note.focus();
      return;
    }
    error.textContent = '';
    note.removeAttribute('aria-invalid');
    decisions[key] = { status: 'changes', note: note.value.trim(), updatedAt: new Date().toISOString() };
    note.dataset.dirty = '';
    save({ kind: 'decision', key, status: 'changes', note: decisions[key]!.note });
    editor.hidden = true;
    trigger.setAttribute('aria-expanded', 'false');
    update();
    trigger.focus({ preventScroll: true });
  });
});
document.querySelectorAll<HTMLButtonElement>('[data-next-pending]').forEach(button => {
  button.addEventListener('click', () => {
    const next = nextPending(button.closest<HTMLElement>('[data-cluster]')!.dataset.cluster!);
    if (!next) return;
    selectCluster(next.key);
    const heading = document.getElementById(`heading-${next.key}`)!;
    heading.scrollIntoView({ block: 'start' });
    heading.focus({ preventScroll: true });
  });
});
reviewer.addEventListener('input', () => save());
const syncMessages: Record<SyncStatus, string> = {
  loading: 'Updating…', saving: 'Saving…',
  saved: 'Saved',
  offline: 'Unable to sync. Check your connection and retry. Pending changes have not been saved to the shared workspace.',
  locked: 'Please unlock the workspace to continue saving shared changes.',
  unconfigured: 'Shared approvals are not connected yet.'
};
sync = new WheelerReviewSync(content.dataset.reviewApi || '', workspace.version, state => {
  for (const key of Object.keys(decisions)) delete decisions[key];
  Object.assign(decisions, state.decisions);
  ideas.splice(0, ideas.length, ...state.ideas);
  document.querySelectorAll<HTMLElement>('[data-cluster]').forEach(detail => {
    const note = detail.querySelector<HTMLTextAreaElement>('textarea')!;
    if (note.dataset.dirty !== 'true' && document.activeElement !== note) note.value = decisions[detail.dataset.cluster!]?.note || '';
  });
  renderIdeas(); update();
}, status => {
  saveStatus.textContent = syncMessages[status];
  saveStatus.dataset.state = status;
  document.querySelector<HTMLElement>('#shared-sync-error')!.hidden = status !== 'offline' && status !== 'unconfigured';
  document.querySelector<HTMLElement>('#retry-shared-review')!.hidden = status !== 'offline';
  if (status === 'locked' && !content.hidden) { content.hidden = true; gate.hidden = false; }
  update();
});
document.querySelector('#retry-shared-review')!.addEventListener('click', () => { void sync.refresh(); });
// Read shared decisions on page load or explicit retry, never on a timer.
// Reconnecting still retries pending saves without waiting for a page reload.
window.addEventListener('online', () => { if (!content.hidden) void sync.refresh(); });
void sync.start().then(open => { if (open) unlock(); });

renderIdeas();
update();
