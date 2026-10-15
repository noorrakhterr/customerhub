import { useState } from 'react';
import { SlideOver } from '../shared/SlideOver';
import { Button } from '../shared/Button';
import { TaskRow } from '../tasks/TaskRow';
import { formatDate } from '../../data/dateUtils';
import { RISK_LEVELS, RISK_LEVEL_LABELS } from '../../data/priority';
import { OUTREACH_INTERVAL_DAYS } from '../../data/taskKinds';
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
  onMarkCustomerResponded: (customerId: string, responseText: string) => void;
  onCloseCustomer: (customerId: string, reason: string) => void;
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
  onCloseCustomer,
  onAddDoc,
}: CustomerDetailPanelProps) {
  const [tab, setTab] = useState<Tab>('details');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [responseText, setResponseText] = useState('');
  const [docTitle, setDocTitle] = useState('');
  const [docLink, setDocLink] = useState('');
  const [docNote, setDocNote] = useState('');
  const [showCloseReasonForm, setShowCloseReasonForm] = useState(false);
  const [closeReason, setCloseReason] = useState('');

  const isClosed = customer.closed;

  const customerTasks = tasks.filter((t) => t.customerId === customer.id);
  const closureLogEntries = customerTasks
    .filter((t) => t.kind === 'closure_log')
    .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
  const outreachTasks = customerTasks
    .filter((t) => t.kind === 'customer_outreach')
    .sort((a, b) => (a.outreachIndex ?? 0) - (b.outreachIndex ?? 0));
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
  const hasResearchCustomer = customerTasks.some((t) => t.kind === 'research_customer');
  const hasMeetingPrep = customerTasks.some((t) => t.kind === 'meeting_prep');
  const showCustomerRespondedForm = hasOutreachStarted && !hasMeetingPrep && !isClosed;
  const showStartOutreach = hasResearchCustomer && !hasOutreachStarted && !isClosed;

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

  const handleStartOutreach = () => {
    const due = new Date();
    due.setDate(due.getDate() + OUTREACH_INTERVAL_DAYS);
    onAddTask({
      customerId: customer.id,
      kind: 'customer_outreach',
      title: '',
      dueDate: due.toISOString(),
      completed: false,
      outreachIndex: 1,
      fields: {},
    });
  };

  const handleMarkResponded = () => {
    onMarkCustomerResponded(customer.id, responseText.trim());
    setResponseText('');
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

  const handleConfirmClose = () => {
    if (!closeReason.trim()) return;
    onCloseCustomer(customer.id, closeReason.trim());
    setCloseReason('');
    setShowCloseReasonForm(false);
  };

  return (
    <SlideOver title={customer.company} onClose={onClose}>
      <div className="tabs">
        <button className={`tab ${tab === 'details' ? 'tab--active' : ''}`} onClick={() => setTab('details')}>
          Details
        </button>
        <button className={`tab ${tab === 'tasks' ? 'tab--active' : ''}`} onClick={() => setTab('tasks')}>
          Timeline ({customerTasks.filter((t) => !t.completed).length})
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
                defaultValue={customer.renewalDate ? customer.renewalDate.slice(0, 10) : ''}
                onBlur={(e) =>
                  onUpdateCustomer(customer.id, {
                    renewalDate: e.target.value ? new Date(e.target.value).toISOString() : '',
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

          {customer.ctaType === 'Value Accelerator' && (
            <div className="form-field">
              <label>Value Accelerator Details</label>
              <textarea
                rows={3}
                defaultValue={customer.valueAcceleratorDetails ?? ''}
                onBlur={(e) =>
                  onUpdateCustomer(customer.id, { valueAcceleratorDetails: e.target.value })
                }
              />
            </div>
          )}

          <div className="customer-detail__close-action">
            {isClosed ? (
              <Button
                variant="ghost"
                small
                onClick={() => onUpdateCustomer(customer.id, { closed: false })}
              >
                Reopen customer
              </Button>
            ) : (
              <Button variant="ghost" small onClick={() => setShowCloseReasonForm(true)}>
                Close customer
              </Button>
            )}
            <Button variant="ghost" small onClick={handleDeleteCustomer}>
              Delete customer
            </Button>
          </div>

          {showCloseReasonForm && (
            <div className="customer-responded-form">
              <div className="form-field">
                <label>Reason for closing</label>
                <textarea
                  rows={2}
                  placeholder="Why is this customer being closed?"
                  value={closeReason}
                  onChange={(e) => setCloseReason(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="form-actions" style={{ justifyContent: 'flex-start' }}>
                <Button variant="ghost" small onClick={handleConfirmClose} disabled={!closeReason.trim()}>
                  Confirm close
                </Button>
                <Button
                  variant="ghost"
                  small
                  onClick={() => {
                    setShowCloseReasonForm(false);
                    setCloseReason('');
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'tasks' && (
        <div className="detail-section">
          {isClosed && (
            <p className="empty-state">
              This customer is closed. Reopen it from the Details tab to add or update tasks.
            </p>
          )}

          {closureLogEntries.map((entry) => (
            <div className="customer-responded-form" key={entry.id}>
              <strong>Closed on {formatDate(entry.dueDate)}</strong>
              <p>{entry.fields.reason}</p>
            </div>
          ))}

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
                  disabled={isClosed}
                />
              ))}
              {outreachTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleTaskComplete}
                  onEditTask={onEditTask}
                  onDeleteTask={onDeleteTask}
                  disabled={isClosed}
                />
              ))}
              {showStartOutreach && (
                <div className="form-actions" style={{ justifyContent: 'flex-start' }}>
                  <Button variant="ghost" small onClick={handleStartOutreach}>
                    + Start outreach
                  </Button>
                </div>
              )}
              {showCustomerRespondedForm && (
                <div className="customer-responded-form">
                  <div className="form-field">
                    <label>Customer response</label>
                    <textarea
                      rows={2}
                      placeholder="What did they say?"
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                    />
                  </div>
                  <div className="form-actions" style={{ justifyContent: 'flex-start' }}>
                    <Button variant="ghost" small onClick={handleMarkResponded}>
                      Customer responded
                    </Button>
                  </div>
                </div>
              )}
              {trailingTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleTaskComplete}
                  onEditTask={onEditTask}
                  onDeleteTask={onDeleteTask}
                  disabled={isClosed}
                />
              ))}
              {customTasks.map((task) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  onToggleComplete={onToggleTaskComplete}
                  onEditTask={onEditTask}
                  onDeleteTask={onDeleteTask}
                  disabled={isClosed}
                />
              ))}
            </>
          )}

          {!isClosed && (
            <>
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
            </>
          )}
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
