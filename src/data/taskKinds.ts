import type { Task, TaskKind } from '../types/task';

export interface TaskFieldDef {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'date';
}

export const TASK_KIND_LABELS: Record<TaskKind, string> = {
  ae_outreach: 'AE outreach',
  research_customer: 'Research customer',
  customer_outreach: 'Customer outreach',
  meeting_prep: 'Meeting Prep',
  meeting_follow_up: 'Meeting Follow-up',
  custom: 'Custom task',
};

export const TASK_KIND_FIELDS: Record<TaskKind, TaskFieldDef[]> = {
  ae_outreach: [{ key: 'exchangeNotes', label: 'Exchange & notes', type: 'textarea' }],
  research_customer: [{ key: 'notes', label: 'Notes', type: 'textarea' }],
  customer_outreach: [{ key: 'notes', label: 'Notes', type: 'textarea' }],
  meeting_prep: [
    { key: 'deckLink', label: 'Deck link', type: 'url' },
    { key: 'prepNotes', label: 'Meeting prep notes', type: 'textarea' },
  ],
  meeting_follow_up: [
    { key: 'recordingLink', label: 'Call recording link', type: 'url' },
    { key: 'followUpEmail', label: 'Follow-up email', type: 'textarea' },
    { key: 'notes', label: 'Notes', type: 'textarea' },
  ],
  custom: [],
};

export const AE_OUTREACH_DUE_IN_DAYS = 3;
export const OUTREACH_INTERVAL_DAYS = 2;

export function taskDisplayTitle(task: Task): string {
  if (task.kind === 'custom') return task.title;
  if (task.kind === 'customer_outreach') return `Outreach ${task.outreachIndex}`;
  return TASK_KIND_LABELS[task.kind];
}
