import { isOverdue, isThisWeek, isToday } from '../../data/dateUtils';
import { hasDueDate } from '../../data/taskKinds';
import type { Customer } from '../../types/customer';
import type { Task } from '../../types/task';
import { AgendaTaskRow } from './AgendaTaskRow';

interface AgendaTasksProps {
  tasks: Task[];
  customers: Customer[];
  range: 'today' | 'week';
  onSelectCustomer: (id: string) => void;
}

export function AgendaTasks({ tasks, customers, range, onSelectCustomer }: AgendaTasksProps) {
  const openCustomerIds = new Set(customers.filter((c) => !c.closed).map((c) => c.id));
  const activeTasks = tasks.filter(
    (t) => !t.completed && openCustomerIds.has(t.customerId) && hasDueDate(t),
  );

  const matches = range === 'today' ? isToday : isThisWeek;
  const overdue = activeTasks
    .filter((t) => isOverdue(t.dueDate))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const upcoming = activeTasks
    .filter((t) => matches(t.dueDate))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const renderRows = (list: Task[]) =>
    list.map((task) => (
      <AgendaTaskRow
        key={task.id}
        task={task}
        customerName={customers.find((c) => c.id === task.customerId)?.company}
        onClick={() => onSelectCustomer(task.customerId)}
      />
    ));

  return (
    <>
      {overdue.length > 0 && (
        <div className="agenda-subsection">
          <h3>Overdue</h3>
          <div className="task-list">{renderRows(overdue)}</div>
        </div>
      )}

      <div className="agenda-subsection">
        <h3>Tasks</h3>
        {upcoming.length === 0 ? (
          <p className="empty-state">Nothing due {range === 'today' ? 'today' : 'this week'}.</p>
        ) : (
          <div className="task-list">{renderRows(upcoming)}</div>
        )}
      </div>
    </>
  );
}
