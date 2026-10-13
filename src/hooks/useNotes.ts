import { useState } from 'react';
import { createNote, deleteNote, listNotes } from '../data/notes';
import type { NewNote, Note } from '../types/note';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(() => listNotes());

  const refresh = () => setNotes(listNotes());

  const add = (input: NewNote) => {
    createNote(input);
    refresh();
  };

  const remove = (id: string) => {
    deleteNote(id);
    refresh();
  };

  return { notes, add, remove, refresh };
}
