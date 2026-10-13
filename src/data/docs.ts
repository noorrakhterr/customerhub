import type { Doc, NewDoc } from '../types/doc';
import { generateId, readList, writeList } from './storage';

const KEY = 'personal-hub:docs';

export function listDocs(): Doc[] {
  return readList<Doc>(KEY);
}

export function createDoc(input: NewDoc): Doc {
  const doc: Doc = { ...input, id: generateId(), createdAt: new Date().toISOString() };
  writeList(KEY, [...listDocs(), doc]);
  return doc;
}

export function deleteDoc(id: string): void {
  writeList(KEY, listDocs().filter((d) => d.id !== id));
}
