import type { NewTask, Task } from '../types/task';
import { generateId, readList, writeList } from './storage';

const KEY = 'personal-hub:tasks';

export function listTasks(): Task[] {
  return readList<Task>(KEY);
}

export function getTask(id: string): Task | undefined {
  return listTasks().find((t) => t.id === id);
}

export function createTask(input: NewTask): Task {
  const now = new Date().toISOString();
  const task: Task = { ...input, id: generateId(), createdAt: now, updatedAt: now };
  writeList(KEY, [...listTasks(), task]);
  return task;
}

export function updateTask(id: string, patch: Partial<NewTask>): Task | undefined {
  const items = listTasks();
  let updated: Task | undefined;
  const next = items.map((t) => {
    if (t.id !== id) return t;
    updated = { ...t, ...patch, updatedAt: new Date().toISOString() };
    return updated;
  });
  writeList(KEY, next);
  return updated;
}

export function deleteTask(id: string): void {
  writeList(KEY, listTasks().filter((t) => t.id !== id));
}
