import { isThisWeek, isToday } from '../../data/dateUtils';
import type { Customer } from '../../types/customer';
import type { Task } from '../../types/task';
import { AgendaTaskRow } from './AgendaTaskRow';

interface AgendaTasksProps {
  tasks: Task[];
  customers: Customer[];
  range: 'today' | 'week';
}

export function AgendaTasks({ tasks, customers, range }: AgendaTasksProps) {
  const matches = range === 'today' ? isToday : isThisWeek;
  const filtered = tasks
    .filter((t) => !t.completed && matches(t.dueDate))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  if (filtered.length === 0) {
    return <p className="empty-state">Nothing due {range === 'today' ? 'today' : 'this week'}.</p>;
  }

  return (
    <div className="task-list">
      {filtered.map((task) => (
        <AgendaTaskRow
          key={task.id}
          task={task}
          customerName={customers.find((c) => c.id === task.customerId)?.company}
        />
      ))}
    </div>
  );
}
