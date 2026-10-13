import type { NewNote, Note } from '../types/note';
import { generateId, readList, writeList } from './storage';

const KEY = 'personal-hub:notes';

export function listNotes(): Note[] {
  return readList<Note>(KEY);
}

export function createNote(input: NewNote): Note {
  const note: Note = { ...input, id: generateId(), createdAt: new Date().toISOString() };
  writeList(KEY, [...listNotes(), note]);
  return note;
}

export function deleteNote(id: string): void {
  writeList(KEY, listNotes().filter((n) => n.id !== id));
}
