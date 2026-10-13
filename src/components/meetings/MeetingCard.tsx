import type { Meeting } from '../../types/meeting';

interface MeetingCardProps {
  meeting: Meeting;
  customerName?: string;
}

export function MeetingCard({ meeting, customerName }: MeetingCardProps) {
  return (
    <div className="meeting-card">
      <h3>{meeting.title}</h3>
      <div className="meeting-card__meta">
        {new Date(meeting.dateTime).toLocaleString(undefined, {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        })}
        {customerName ? ` · ${customerName}` : ''}
      </div>
    </div>
  );
}
