import { useState } from 'react';
import { Section } from '../layout/Section';
import { Button } from '../shared/Button';
import type { NewNote, Note } from '../../types/note';

interface QuickNotesProps {
  notes: Note[];
  onAdd: (input: NewNote) => void;
  onDelete: (id: string) => void;
}

export function QuickNotes({ notes, onAdd, onDelete }: QuickNotesProps) {
  const [content, setContent] = useState('');

  const sorted = [...notes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const handleAdd = () => {
    if (!content.trim()) return;
    onAdd({ content: content.trim() });
    setContent('');
  };

  return (
    <Section title="Quick Notes">
      {sorted.length === 0 ? (
        <p className="empty-state">Nothing jotted down yet.</p>
      ) : (
        <div className="quick-notes">
          {sorted.map((note) => (
            <div className="quick-note-item" key={note.id}>
              <div>{note.content}</div>
              <button
                className="task-row__delete"
                onClick={() => onDelete(note.id)}
                aria-label="Delete note"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="form-field" style={{ marginTop: 'var(--space-2)' }}>
        <textarea
          rows={2}
          placeholder="Jot something down..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <div className="form-actions">
        <Button variant="ghost" small onClick={handleAdd}>
          Add note
        </Button>
      </div>
    </Section>
  );
}
