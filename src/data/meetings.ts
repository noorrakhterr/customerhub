import type { Meeting, NewMeeting } from '../types/meeting';
import { generateId, readList, writeList } from './storage';

const KEY = 'personal-hub:meetings';

export function listMeetings(): Meeting[] {
  return readList<Meeting>(KEY);
}

export function getMeeting(id: string): Meeting | undefined {
  return listMeetings().find((m) => m.id === id);
}

export function createMeeting(input: NewMeeting): Meeting {
  const now = new Date().toISOString();
  const meeting: Meeting = { ...input, id: generateId(), createdAt: now, updatedAt: now };
  writeList(KEY, [...listMeetings(), meeting]);
  return meeting;
}

export function updateMeeting(id: string, patch: Partial<NewMeeting>): Meeting | undefined {
  const items = listMeetings();
  let updated: Meeting | undefined;
  const next = items.map((m) => {
    if (m.id !== id) return m;
    updated = { ...m, ...patch, updatedAt: new Date().toISOString() };
    return updated;
  });
  writeList(KEY, next);
  return updated;
}

export function deleteMeeting(id: string): void {
  writeList(KEY, listMeetings().filter((m) => m.id !== id));
}
