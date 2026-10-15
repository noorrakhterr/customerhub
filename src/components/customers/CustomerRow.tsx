import { formatDate } from '../../data/dateUtils';
import { taskDisplayTitle } from '../../data/taskKinds';
import type { Customer } from '../../types/customer';
import type { Task } from '../../types/task';

interface CustomerRowProps {
  customer: Customer;
  tasks: Task[];
  onClick: () => void;
  onDelete: () => void;
}

export function CustomerRow({ customer, tasks, onClick, onDelete }: CustomerRowProps) {
  const openTasks = tasks
    .filter((t) => t.customerId === customer.id && !t.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  const nextTask = openTasks[0];

  return (
    <tr className="customer-row" onClick={onClick}>
      <td>
        <div className="customer-row__company">{customer.company}</div>
      </td>
      <td>{customer.accountExecutive || '—'}</td>
      <td>{customer.ctaType}</td>
      <td>{nextTask ? taskDisplayTitle(nextTask) : '—'}</td>
      <td>{nextTask ? formatDate(nextTask.dueDate) : '—'}</td>
      <td className="col-delete">
        <button
          className="customer-row__delete"
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm(`Delete ${customer.company}? This cannot be undone.`)) {
              onDelete();
            }
          }}
          aria-label="Delete customer"
        >
          ×
        </button>
      </td>
    </tr>
  );
}
