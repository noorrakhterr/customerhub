import { TASK_KIND_FIELDS, taskDisplayTitle } from '../../data/taskKinds';
import type { NewTask, Task } from '../../types/task';

interface TaskRowProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEditTask: (id: string, patch: Partial<NewTask>) => void;
  onDeleteTask: (id: string) => void;
}

export function TaskRow({ task, onToggleComplete, onEditTask, onDeleteTask }: TaskRowProps) {
  const fieldDefs = TASK_KIND_FIELDS[task.kind];

  const handleFieldChange = (key: string, value: string) => {
    onEditTask(task.id, { fields: { ...task.fields, [key]: value } });
  };

  return (
    <div className="task-row">
      <div className="task-row__main">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggleComplete(task.id)}
        />
        <div className="task-row__title">{taskDisplayTitle(task)}</div>
        <input
          type="date"
          className="task-row__due"
          defaultValue={task.dueDate.slice(0, 10)}
          onBlur={(e) => onEditTask(task.id, { dueDate: new Date(e.target.value).toISOString() })}
        />
        <button
          className="task-row__delete"
          onClick={() => onDeleteTask(task.id)}
          aria-label="Delete task"
        >
          ×
        </button>
      </div>

      {fieldDefs.length > 0 && (
        <div className="task-row__fields">
          {fieldDefs.map((def) => (
            <div className="form-field" key={def.key}>
              <label>{def.label}</label>
              {def.type === 'textarea' ? (
                <textarea
                  rows={2}
                  defaultValue={task.fields[def.key] ?? ''}
                  onBlur={(e) => handleFieldChange(def.key, e.target.value)}
                />
              ) : (
                <input
                  type={def.type}
                  defaultValue={task.fields[def.key] ?? ''}
                  onBlur={(e) => handleFieldChange(def.key, e.target.value)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
