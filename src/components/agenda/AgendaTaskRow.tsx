import { formatDate } from '../../data/dateUtils';
import { taskDisplayTitle } from '../../data/taskKinds';
import type { Task } from '../../types/task';

interface AgendaTaskRowProps {
  task: Task;
  customerName?: string;
}

export function AgendaTaskRow({ task, customerName }: AgendaTaskRowProps) {
  return (
    <div className="task-item">
      <div>
        <div className="task-item__title">{taskDisplayTitle(task)}</div>
        <div className="task-item__meta">
          {formatDate(task.dueDate)}
          {customerName ? ` · ${customerName}` : ''}
        </div>
      </div>
    </div>
  );
}
