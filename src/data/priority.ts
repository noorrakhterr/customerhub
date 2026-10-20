import { hasDueDate } from './taskKinds';
import type { Customer, RiskLevel } from '../types/customer';
import type { Task } from '../types/task';

export const RISK_LEVELS: RiskLevel[] = ['critical', 'high', 'moderate', 'low'];

export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  critical: 'Critical',
  high: 'High',
  moderate: 'Moderate',
  low: 'Low',
};

function nextTaskDueTime(customerId: string, tasks: Task[]): number {
  const dueDates = tasks
    .filter((t) => t.customerId === customerId && !t.completed && hasDueDate(t))
    .map((t) => new Date(t.dueDate).getTime());
  return dueDates.length > 0 ? Math.min(...dueDates) : Infinity;
}

export function groupByRisk(
  customers: Customer[],
  tasks: Task[],
): Record<RiskLevel, Customer[]> {
  const groups: Record<RiskLevel, Customer[]> = {
    critical: [],
    high: [],
    moderate: [],
    low: [],
  };
  for (const customer of customers) {
    const level = RISK_LEVELS.includes(customer.riskLevel) ? customer.riskLevel : 'moderate';
    groups[level].push(customer);
  }
  for (const level of RISK_LEVELS) {
    groups[level].sort(
      (a, b) => nextTaskDueTime(a.id, tasks) - nextTaskDueTime(b.id, tasks),
    );
  }
  return groups;
}
