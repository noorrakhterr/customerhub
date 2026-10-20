import { useState } from 'react';
import { getCustomer } from '../data/customers';
import { createTask, deleteTask, listTasks, updateTask } from '../data/tasks';
import { toDateOnlyIso } from '../data/dateUtils';
import { AE_OUTREACH_DUE_IN_DAYS, OUTREACH_INTERVAL_DAYS } from '../data/taskKinds';
import type { NewTask, Task } from '../types/task';

function isCustomerClosed(customerId: string): boolean {
  return getCustomer(customerId)?.closed ?? false;
}

function addDays(dateOnlyIso: string, days: number): string {
  const [year, month, day] = dateOnlyIso.slice(0, 10).split('-').map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + days);
  return toDateOnlyIso(d);
}

function isoInDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toDateOnlyIso(d);
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => listTasks());

  const refresh = () => setTasks(listTasks());

  const add = (input: NewTask) => {
    if (isCustomerClosed(input.customerId)) return;
    createTask(input);
    refresh();
  };

  const edit = (id: string, patch: Partial<NewTask>) => {
    updateTask(id, patch);
    refresh();
  };

  const remove = (id: string) => {
    deleteTask(id);
    refresh();
  };

  const removeAllForCustomer = (customerId: string) => {
    for (const task of listTasks().filter((t) => t.customerId === customerId)) {
      deleteTask(task.id);
    }
    refresh();
  };

  const createInitialTask = (customerId: string) => {
    createTask({
      customerId,
      kind: 'ae_outreach',
      title: '',
      dueDate: isoInDays(AE_OUTREACH_DUE_IN_DAYS),
      completed: false,
      fields: {},
    });
    refresh();
  };

  const addClosureLogEntry = (customerId: string, reason: string) => {
    createTask({
      customerId,
      kind: 'closure_log',
      title: '',
      dueDate: isoInDays(0),
      completed: true,
      fields: { reason },
    });
    refresh();
  };

  const markCustomerResponded = (customerId: string, responseText: string) => {
    if (isCustomerClosed(customerId)) return;
    const existing = listTasks().filter((t) => t.customerId === customerId);
    if (existing.some((t) => t.kind === 'meeting_prep')) return;
    createTask({
      customerId,
      kind: 'meeting_prep',
      title: '',
      dueDate: isoInDays(0),
      completed: false,
      fields: { customerResponse: responseText },
    });
    refresh();
  };

  const toggleComplete = (id: string) => {
    const current = listTasks();
    const task = current.find((t) => t.id === id);
    if (!task) return;
    const completed = !task.completed;
    updateTask(id, { completed });

    if (completed && !isCustomerClosed(task.customerId)) {
      const customerTasks = current.filter((t) => t.customerId === task.customerId);
      const hasKind = (kind: Task['kind']) => customerTasks.some((t) => t.kind === kind);

      if (task.kind === 'ae_outreach' && !hasKind('research_customer')) {
        createTask({
          customerId: task.customerId,
          kind: 'research_customer',
          title: '',
          dueDate: '',
          completed: false,
          fields: {},
        });
      } else if (task.kind === 'research_customer' && !hasKind('customer_outreach')) {
        createTask({
          customerId: task.customerId,
          kind: 'customer_outreach',
          title: '',
          dueDate: isoInDays(2),
          completed: false,
          outreachIndex: 1,
          fields: {},
        });
      } else if (task.kind === 'customer_outreach' && !hasKind('meeting_prep')) {
        const nextIndex = (task.outreachIndex ?? 1) + 1;
        const nextAlreadyExists = customerTasks.some(
          (t) => t.kind === 'customer_outreach' && t.outreachIndex === nextIndex,
        );
        if (!nextAlreadyExists) {
          createTask({
            customerId: task.customerId,
            kind: 'customer_outreach',
            title: '',
            dueDate: addDays(task.dueDate, OUTREACH_INTERVAL_DAYS),
            completed: false,
            outreachIndex: nextIndex,
            fields: { contactedPerson: task.fields.contactedPerson ?? '' },
          });
        }
      } else if (task.kind === 'meeting_prep' && !hasKind('meeting_follow_up')) {
        createTask({
          customerId: task.customerId,
          kind: 'meeting_follow_up',
          title: '',
          dueDate: addDays(task.dueDate, 1),
          completed: false,
          fields: {},
        });
      }
    }

    refresh();
  };

  return {
    tasks,
    add,
    edit,
    remove,
    removeAllForCustomer,
    createInitialTask,
    markCustomerResponded,
    addClosureLogEntry,
    toggleComplete,
    refresh,
  };
}
