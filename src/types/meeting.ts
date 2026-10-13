export interface Meeting {
  id: string;
  title: string;
  dateTime: string;
  customerId?: string;
  attendees?: string;
  createdAt: string;
  updatedAt: string;
}

export type NewMeeting = Omit<Meeting, 'id' | 'createdAt' | 'updatedAt'>;
