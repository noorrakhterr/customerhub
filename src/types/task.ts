export type TaskKind =
  | 'ae_outreach'
  | 'research_customer'
  | 'customer_outreach'
  | 'meeting_prep'
  | 'meeting_follow_up'
  | 'custom'
  | 'closure_log';

export interface Task {
  id: string;
  customerId: string;
  kind: TaskKind;
  title: string;
  dueDate: string;
  completed: boolean;
  outreachIndex?: number;
  fields: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export type NewTask = Omit<Task, 'id' | 'createdAt' | 'updatedAt'>;
