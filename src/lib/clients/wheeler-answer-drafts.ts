// Keep unconfirmed edits on this browser until the shared service acknowledges them.
export class AnswerDrafts {
 private memory = new Map<string,string>();
 constructor(private storage: Pick<Storage,'getItem'|'setItem'|'removeItem'> | null, private prefix: string) {}
 get(key: string): string | null {
  if (this.memory.has(key)) return this.memory.get(key)!;
  try { const text=this.storage?.getItem(this.prefix+key) ?? null; if(text!==null)this.memory.set(key,text); return text; }
  catch { return null; }
 }
 set(key: string, text: string): boolean {
  this.memory.set(key,text);
  try { if(!this.storage)return false;this.storage.setItem(this.prefix+key,text);return true; } catch { return false; }
 }
 clear(key: string) {
  this.memory.delete(key);
  try { this.storage?.removeItem(this.prefix+key); } catch { /* A retained draft is safer than losing text. */ }
 }
}
