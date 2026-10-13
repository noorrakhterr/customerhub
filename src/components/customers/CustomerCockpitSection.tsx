import { useState } from 'react';
import { Section } from '../layout/Section';
import { Button } from '../shared/Button';
import { AddCustomerForm } from '../forms/AddCustomerForm';
import { CustomerTable } from './CustomerTable';
import { groupByRisk } from '../../data/priority';
import type { Customer, NewCustomer } from '../../types/customer';
import type { Task } from '../../types/task';

type View = 'active' | 'closed';

interface CustomerCockpitSectionProps {
  customers: Customer[];
  tasks: Task[];
  onSelectCustomer: (id: string) => void;
  onAddCustomer: (input: NewCustomer) => void;
  onDeleteCustomer: (id: string) => void;
}

export function CustomerCockpitSection({
  customers,
  tasks,
  onSelectCustomer,
  onAddCustomer,
  onDeleteCustomer,
}: CustomerCockpitSectionProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [view, setView] = useState<View>('active');

  const visibleCustomers = customers.filter((c) => (view === 'active' ? !c.closed : c.closed));
  const groups = groupByRisk(visibleCustomers, tasks);

  return (
    <Section
      title="Customer Cockpit"
      actions={
        <>
          <div className="range-toggle">
            <button
              className={`range-toggle__option ${view === 'active' ? 'range-toggle__option--active' : ''}`}
              onClick={() => setView('active')}
            >
              Active
            </button>
            <button
              className={`range-toggle__option ${view === 'closed' ? 'range-toggle__option--active' : ''}`}
              onClick={() => setView('closed')}
            >
              Closed
            </button>
          </div>
          <Button small onClick={() => setShowAddForm(true)}>
            + Customer
          </Button>
        </>
      }
    >
      {visibleCustomers.length === 0 ? (
        <p className="empty-state">
          {view === 'active' ? 'No customers yet. Add your first one above.' : 'No closed customers.'}
        </p>
      ) : (
        <CustomerTable
          groups={groups}
          tasks={tasks}
          onSelectCustomer={onSelectCustomer}
          onDeleteCustomer={onDeleteCustomer}
        />
      )}

      {showAddForm && (
        <AddCustomerForm
          onClose={() => setShowAddForm(false)}
          onSubmit={onAddCustomer}
        />
      )}
    </Section>
  );
}
