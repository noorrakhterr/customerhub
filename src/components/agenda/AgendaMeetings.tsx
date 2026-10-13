import { useState } from 'react';
import { isThisWeek, isToday } from '../../data/dateUtils';
import { Button } from '../shared/Button';
import { AddMeetingForm } from '../forms/AddMeetingForm';
import { MeetingCard } from '../meetings/MeetingCard';
import type { Customer } from '../../types/customer';
import type { Meeting, NewMeeting } from '../../types/meeting';

interface AgendaMeetingsProps {
  meetings: Meeting[];
  customers: Customer[];
  range: 'today' | 'week';
  onAdd: (input: NewMeeting) => void;
}

export function AgendaMeetings({ meetings, customers, range, onAdd }: AgendaMeetingsProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const matches = range === 'today' ? isToday : isThisWeek;
  const filtered = meetings
    .filter((m) => matches(m.dateTime))
    .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

  return (
    <div className="agenda-subsection">
      <div className="agenda-subsection__header">
        <h3>Meetings</h3>
        <Button small variant="ghost" onClick={() => setShowAddForm(true)}>
          + Meeting
        </Button>
      </div>

      {filtered.length === 0 ? (
        <p className="empty-state">No meetings {range === 'today' ? 'today' : 'this week'}.</p>
      ) : (
        <div className="meeting-list">
          {filtered.map((meeting) => (
            <MeetingCard
              key={meeting.id}
              meeting={meeting}
              customerName={customers.find((c) => c.id === meeting.customerId)?.company}
            />
          ))}
        </div>
      )}

      {showAddForm && (
        <AddMeetingForm
          customers={customers}
          onClose={() => setShowAddForm(false)}
          onSubmit={onAdd}
        />
      )}
    </div>
  );
}
