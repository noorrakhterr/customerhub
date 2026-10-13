import { useState } from 'react';
import { createMeeting, deleteMeeting, listMeetings, updateMeeting } from '../data/meetings';
import type { Meeting, NewMeeting } from '../types/meeting';

export function useMeetings() {
  const [meetings, setMeetings] = useState<Meeting[]>(() => listMeetings());

  const refresh = () => setMeetings(listMeetings());

  const add = (input: NewMeeting) => {
    createMeeting(input);
    refresh();
  };

  const edit = (id: string, patch: Partial<NewMeeting>) => {
    updateMeeting(id, patch);
    refresh();
  };

  const remove = (id: string) => {
    deleteMeeting(id);
    refresh();
  };

  return { meetings, add, edit, remove, refresh };
}
