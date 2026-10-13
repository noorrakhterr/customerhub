export interface Note {
  id: string;
  content: string;
  createdAt: string;
}

export type NewNote = Omit<Note, 'id' | 'createdAt'>;
