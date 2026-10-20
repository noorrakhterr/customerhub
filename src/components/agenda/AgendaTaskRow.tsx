import { formatDueDate } from '../../data/dateUtils';
import { taskDisplayTitle } from '../../data/taskKinds';
import type { Task } from '../../types/task';

interface AgendaTaskRowProps {
  task: Task;
  customerName?: string;
  onClick: () => void;
}

export function AgendaTaskRow({ task, customerName, onClick }: AgendaTaskRowProps) {
  return (
    <div className="task-item task-item--clickable" onClick={onClick}>
      <div>
        <div className="task-item__title">{taskDisplayTitle(task)}</div>
        <div className="task-item__meta">
          {formatDueDate(task.dueDate)}
          {customerName ? ` · ${customerName}` : ''}
        </div>
      </div>
    </div>
  );
}
