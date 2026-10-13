import { useState } from 'react';
import { SlideOver } from '../shared/SlideOver';
import { Button } from '../shared/Button';
import { OutreachGroup } from '../tasks/OutreachGroup';
import { TaskRow } from '../tasks/TaskRow';
import { RISK_LEVELS, RISK_LEVEL_LABELS } from '../../data/priority';
import type { CtaType, Customer, NewCustomer, RiskLevel } from '../../types/customer';
import type { Doc, NewDoc } from '../../types/doc';
import type { NewTask, Task, TaskKind } from '../../types/task';

type Tab = 'details' | 'tasks' | 'docs';

const CTA_TYPES: CtaType[] = ['Value Accelerator', 'OCI', 'OWI', 'AMFA'];
const LEADING_KINDS: TaskKind[] = ['ae_outreach', 'research_customer'];
const TRAILING_KINDS: TaskKind[] = ['meeting_prep', 'meeting_follow_up'];

interface CustomerDetailPanelProps {
  customer: Customer;
  tasks: Task[];
  docs: Doc[];
  onClose: () => void;
  onUpdateCustomer: (id: string, patch: Partial<NewCustomer>) => void;
  onDeleteCustomer: (id: string) => void;
  onAddTask: (input: NewTask) => void;
  onEditTask: (id: string, patch: Partial<NewTask>) => void;
  onDeleteTask: (id: string) => void;
  onToggleTaskComplete: (id: string) => void;
  onMarkCustomerResponded: (customerId: string) => void;
  onAddDoc: (input: NewDoc) => void;
}

export function CustomerDetailPanel({
  customer,
  tasks,
  docs,
  onClose,
  onUpdateCustomer,
  onDeleteCustomer,
  onAddTask,
  onEditTask,
  onDeleteTask,
  onToggleTaskComplete,
  onMarkCustomerResponded,
  onAddDoc,
}: CustomerDetailPanelProps) {
  const [tab, setTab] = useState<Tab>('details');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [docTitle, setDocTitle] = useState('');
  const [docLink, setDocLink] = useState('');
  const [docNote, setDocNote] = useState('');

  const customerTasks = tasks.filter((t) => t.customerId === customer.id);
  const outreachTasks = customerTasks.filter((t) => t.kind === 'customer_outreach');
  const leadingTasks = LEADING_KINDS.map((kind) =>
    customerTasks.find((t) => t.kind === kind),
  ).filter((t): t is Task => Boolean(t));
  const trailingTasks = TRAILING_KINDS.map((kind) =>
    customerTasks.find((t) => t.kind === kind),
  ).filter((t): t is Task => Boolean(t));
  const customTasks = customerTasks
    .filter((t) => t.kind === 'custom')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const hasOutreachStarted = outreachTasks.length > 0;
  const hasMeetingPrep = customerTasks.some((t) => t.kind === 'meeting_prep');
  const showCustomerRespondedButton = hasOutreachStarted && !hasMeetingPrep;

  const customerDocs = docs.filter((d) => d.customerId === customer.id);

  const handleAddCustomTask = () => {
    if (!newTaskTitle.trim() || !newTaskDueDate) return;
    onAddTask({
      customerId: customer.id,
      kind: 'custom',
      title: newTaskTitle.trim(),
      dueDate: new Date(newTaskDueDate).toISOString(),
      completed: false,
      fields: {},
    });
    setNewTaskTitle('');
    setNewTaskDueDate('');
  };

  const handleAddDoc = () => {
    if (!docTitle.trim() || !docLink.trim()) return;
    onAddDoc({
      customerId: customer.id,
      title: docTitle.trim(),
      link: docLink.trim(),
      note: docNote.trim() || undefined,
    });
    setDocTitle('');
    setDocLink('');
    setDocNote('');
  };

  const handleDeleteCustomer = () => {
    if (window.confirm(`Delete ${customer.company}? This cannot be undone.`)) {
      onDeleteCustomer(customer.id);
      onClose();
    }
  };

  return (
    <SlideOver title={customer.company} onClose={onClose}>
      <div className="tabs">
        <button className={`tab ${tab === 'details' ? 'tab--active' : ''}`} onClick={() => setTab('details')}>
          Details
        </button>
        <button className={`tab ${tab === 'tasks' ? 'tab--active' : ''}`} onClick={() => setTab('tasks')}>
          Tasks ({customerTasks.filter((t) => !t.completed).length})
        </button>
        <button className={`tab ${tab === 'docs' ? 'tab--active' : ''}`} onClick={() => setTab('docs')}>
          Docs
        </button>
      </div>

      {tab === 'details' && (
        <div className="detail-section">
          <div className="form-row">
            <div className="form-field">
              <label>Primary contact</label>
              <input
                defaultValue={customer.name}
                onBlur={(e) => onUpdateCustomer(customer.id, { name: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label>Company</label>
              <input
                defaultValue={customer.company}
                onBlur={(e) => onUpdateCustomer(customer.id, { company: e.target.value })}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Account Executive</label>
              <input
                defaultValue={customer.accountExecutive}
                onBlur={(e) => onUpdateCustomer(customer.id, { accountExecutive: e.target.value })}
              />
            </div>
            <div className="form-field">
              <label>CTA type</label>
              <select
                defaultValue={customer.ctaType}
                onChange={(e) => onUpdateCustomer(customer.id, { ctaType: e.target.value as CtaType })}
              >
                {CTA_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Risk level</label>
              <select
                defaultValue={customer.riskLevel}
                onChange={(e) => onUpdateCustomer(customer.id, { riskLevel: e.target.value as RiskLevel })}
              >
                {RISK_LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {RISK_LEVEL_LABELS[level]}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <label>Renewal date</label>
              <input
                type="date"
                defaultValue={customer.renewalDate.slice(0, 10)}
                onBlur={(e) =>
                  onUpdateCustomer(customer.id, {
                    renewalDate: new Date(e.target.value).toISOString(),
                  })
                }
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Health score (0–100)</label>
              <input
                type="number"
                min={0}
                max={100}
                defaultValue={customer.healthScore}
                onBlur={(e) =>
                  onUpdateCustomer(customer.id, { healthScore: Number(e.target.value) })
                }
              />
            </div>
            <div className="form-field">
              <label>ARR</label>
              <input
                type="number"
                defaultValue={customer.arr ?? ''}
                onBlur={(e) =>
                  onUpdateCustomer(customer.id, {
                    arr: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
              />
            </div>
          </div>

          {customer.riskLevel === 'critical' && (
            <div className="form-field">
              <label>Path 2 Green Plan link</label>
              <input
                type="url"
                defaultValue={customer.pathToGreenLink ?? ''}
                onBlur={(e) => onUpdateCustomer(customer.id, { pathToGreenLink: e.target.value })}
              />
            </div>
          )}

          <div className="customer-detail__close-action">
            <Button
              variant="ghost"
              small
              onClick={() => onUpdateCustomer(customer.id, { closed: !customer.closed })}
            >
              {customer.closed ? 'Reopen customer' : 'Close customer'}
            </Button>
            <Button variant="ghost" small onClick={handleDeleteCustomer}>
              Delete customer
            </Button>
          </div>
        </div>
      )}

      {tab === 'tasks' && (
        <div className="detail-section">
          {leadingTasks.length === 0 && outreachTasks.length === 0 && trailingTasks.length === 0 && customTasks.length === 0 ? (
            <p className="empty-state">No tasks yet.</p>
          ) : (
            <>
              {leadingTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleTaskComplete}
                  onEditTask={onEditTask}
                  onDeleteTask={onDeleteTask}
                />
              ))}
              <OutreachGroup
                customerId={customer.id}
                outreachTasks={outreachTasks}
                onToggleComplete={onToggleTaskComplete}
                onEditTask={onEditTask}
                onDeleteTask={onDeleteTask}
                onAddTask={onAddTask}
              />
              {showCustomerRespondedButton && (
                <div className="form-actions" style={{ justifyContent: 'flex-start' }}>
                  <Button variant="ghost" small onClick={() => onMarkCustomerResponded(customer.id)}>
                    Customer responded
                  </Button>
                </div>
              )}
              {trailingTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleTaskComplete}
                  onEditTask={onEditTask}
                  onDeleteTask={onDeleteTask}
                />
              ))}
              {customTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleTaskComplete}
                  onEditTask={onEditTask}
                  onDeleteTask={onDeleteTask}
                />
              ))}
            </>
          )}

          <div className="form-row" style={{ marginTop: 'var(--space-3)' }}>
            <input
              placeholder="New task title"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <input
              type="date"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
            />
          </div>
          <div className="form-actions">
            <Button variant="ghost" small onClick={handleAddCustomTask}>
              Add task
            </Button>
          </div>
        </div>
      )}

      {tab === 'docs' && (
        <div className="detail-section">
          {customerDocs.length === 0 ? (
            <p className="empty-state">No docs yet.</p>
          ) : (
            <div className="doc-list">
              {customerDocs.map((doc) => (
                <div className="doc-item" key={doc.id}>
                  <a href={doc.link} target="_blank" rel="noreferrer">
                    {doc.title}
                  </a>
                  {doc.note && <div className="task-item__meta">{doc.note}</div>}
                </div>
              ))}
            </div>
          )}

          <div className="form-field" style={{ marginTop: 'var(--space-3)' }}>
            <label>Title</label>
            <input value={docTitle} onChange={(e) => setDocTitle(e.target.value)} />
          </div>
          <div className="form-field">
            <label>Link</label>
            <input type="url" value={docLink} onChange={(e) => setDocLink(e.target.value)} />
          </div>
          <div className="form-field">
            <label>Note (optional)</label>
            <input value={docNote} onChange={(e) => setDocNote(e.target.value)} />
          </div>
          <div className="form-actions">
            <Button variant="ghost" small onClick={handleAddDoc}>
              Add doc
            </Button>
          </div>
        </div>
      )}
    </SlideOver>
  );
}
