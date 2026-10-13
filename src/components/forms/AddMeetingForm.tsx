import { useState } from 'react';
import { Modal } from '../shared/Modal';
import { Button } from '../shared/Button';
import type { Customer } from '../../types/customer';
import type { NewMeeting } from '../../types/meeting';

interface AddMeetingFormProps {
  customers: Customer[];
  onClose: () => void;
  onSubmit: (input: NewMeeting) => void;
}

export function AddMeetingForm({ customers, onClose, onSubmit }: AddMeetingFormProps) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [attendees, setAttendees] = useState('');

  const canSubmit = title.trim() && date;

  const handleSubmit = () => {
    if (!canSubmit) return;
    const dateTime = time ? `${date}T${time}` : date;
    onSubmit({
      title: title.trim(),
      dateTime: new Date(dateTime).toISOString(),
      customerId: customerId || undefined,
      attendees: attendees.trim() || undefined,
    });
    onClose();
  };

  return (
    <Modal title="Add meeting" onClose={onClose}>
      <div className="form-field">
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
      </div>
      <div className="form-row">
        <div className="form-field">
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="form-field">
          <label>Time (optional)</label>
          <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-field">
          <label>Customer (optional)</label>
          <select value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
            <option value="">— General —</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.company}
              </option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label>Attendees</label>
          <input value={attendees} onChange={(e) => setAttendees(e.target.value)} />
        </div>
      </div>
      <div className="form-actions">
        <Button variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} disabled={!canSubmit}>
          Add meeting
        </Button>
      </div>
    </Modal>
  );
}
