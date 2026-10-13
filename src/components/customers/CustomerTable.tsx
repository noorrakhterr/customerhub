import { Fragment } from 'react';
import { RISK_LEVELS, RISK_LEVEL_LABELS } from '../../data/priority';
import type { Customer, RiskLevel } from '../../types/customer';
import type { Task } from '../../types/task';
import { CustomerRow } from './CustomerRow';

interface CustomerTableProps {
  groups: Record<RiskLevel, Customer[]>;
  tasks: Task[];
  onSelectCustomer: (id: string) => void;
  onDeleteCustomer: (id: string) => void;
}

export function CustomerTable({ groups, tasks, onSelectCustomer, onDeleteCustomer }: CustomerTableProps) {
  return (
    <table className="cockpit-table">
      <thead>
        <tr>
          <th>Company</th>
          <th>AE</th>
          <th>CTA Type</th>
          <th>Next Task</th>
          <th>Next Task Due</th>
          <th className="col-delete"></th>
        </tr>
      </thead>
      <tbody>
        {RISK_LEVELS.map((level) => {
          const customers = groups[level];
          if (customers.length === 0) return null;
          return (
            <Fragment key={level}>
              <tr className={`tier-row tier-row--${level}`}>
                <td colSpan={6}>
                  {RISK_LEVEL_LABELS[level]} ({customers.length})
                </td>
              </tr>
              {customers.map((customer) => (
                <CustomerRow
                  key={customer.id}
                  customer={customer}
                  tasks={tasks}
                  onClick={() => onSelectCustomer(customer.id)}
                  onDelete={() => onDeleteCustomer(customer.id)}
                />
              ))}
            </Fragment>
          );
        })}
      </tbody>
    </table>
  );
}
