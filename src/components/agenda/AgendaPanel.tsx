import { useState } from 'react';
import { Section } from '../layout/Section';
import { AgendaTasks } from './AgendaTasks';
import { AgendaMeetings } from './AgendaMeetings';
import type { Customer } from '../../types/customer';
import type { Meeting, NewMeeting } from '../../types/meeting';
import type { Task } from '../../types/task';

type Range = 'today' | 'week';

interface AgendaPanelProps {
  tasks: Task[];
  meetings: Meeting[];
  customers: Customer[];
  onAddMeeting: (input: NewMeeting) => void;
}

export function AgendaPanel({
  tasks,
  meetings,
  customers,
  onAddMeeting,
}: AgendaPanelProps) {
  const [range, setRange] = useState<Range>('today');

  return (
    <Section
      title="Agenda"
      actions={
        <div className="range-toggle">
          <button
            className={`range-toggle__option ${range === 'today' ? 'range-toggle__option--active' : ''}`}
            onClick={() => setRange('today')}
          >
            Today
          </button>
          <button
            className={`range-toggle__option ${range === 'week' ? 'range-toggle__option--active' : ''}`}
            onClick={() => setRange('week')}
          >
            This Week
          </button>
        </div>
      }
    >
      <div className="agenda-subsection">
        <h3>Tasks</h3>
        <AgendaTasks tasks={tasks} customers={customers} range={range} />
      </div>

      <AgendaMeetings
        meetings={meetings}
        customers={customers}
        range={range}
        onAdd={onAddMeeting}
      />
    </Section>
  );
}
