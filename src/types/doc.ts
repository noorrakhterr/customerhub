export interface Doc {
  id: string;
  customerId: string;
  title: string;
  link: string;
  note?: string;
  createdAt: string;
}

export type NewDoc = Omit<Doc, 'id' | 'createdAt'>;
