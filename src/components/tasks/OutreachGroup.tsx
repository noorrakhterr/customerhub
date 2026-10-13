import { useState } from 'react';
import { Button } from '../shared/Button';
import { OUTREACH_INTERVAL_DAYS } from '../../data/taskKinds';
import type { NewTask, Task } from '../../types/task';
import { TaskRow } from './TaskRow';

interface OutreachGroupProps {
  customerId: string;
  outreachTasks: Task[];
  onToggleComplete: (id: string) => void;
  onEditTask: (id: string, patch: Partial<NewTask>) => void;
  onDeleteTask: (id: string) => void;
  onAddTask: (input: NewTask) => void;
}

export function OutreachGroup({
  customerId,
  outreachTasks,
  onToggleComplete,
  onEditTask,
  onDeleteTask,
  onAddTask,
}: OutreachGroupProps) {
  const [expanded, setExpanded] = useState(true);

  const sorted = [...outreachTasks].sort(
    (a, b) => (a.outreachIndex ?? 0) - (b.outreachIndex ?? 0),
  );

  const handleStartOutreach = () => {
    const due = new Date();
    due.setDate(due.getDate() + OUTREACH_INTERVAL_DAYS);
    onAddTask({
      customerId,
      kind: 'customer_outreach',
      title: '',
      dueDate: due.toISOString(),
      completed: false,
      outreachIndex: 1,
      fields: {},
    });
  };

  if (sorted.length === 0) {
    return (
      <div className="outreach-group">
        <Button variant="ghost" small onClick={handleStartOutreach}>
          + Start outreach
        </Button>
      </div>
    );
  }

  return (
    <div className="outreach-group">
      <button className="outreach-group__toggle" onClick={() => setExpanded(!expanded)}>
        {expanded ? '▾' : '▸'} Outreach ({sorted.length})
      </button>
      {expanded &&
        sorted.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        ))}
    </div>
  );
}
