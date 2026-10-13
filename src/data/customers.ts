import type { Customer, NewCustomer } from '../types/customer';
import { generateId, readList, writeList } from './storage';

const KEY = 'personal-hub:customers';

export function listCustomers(): Customer[] {
  return readList<Customer>(KEY);
}

export function getCustomer(id: string): Customer | undefined {
  return listCustomers().find((c) => c.id === id);
}

export function createCustomer(input: NewCustomer): Customer {
  const now = new Date().toISOString();
  const customer: Customer = { ...input, id: generateId(), createdAt: now, updatedAt: now };
  writeList(KEY, [...listCustomers(), customer]);
  return customer;
}

export function updateCustomer(id: string, patch: Partial<NewCustomer>): Customer | undefined {
  const items = listCustomers();
  let updated: Customer | undefined;
  const next = items.map((c) => {
    if (c.id !== id) return c;
    updated = { ...c, ...patch, updatedAt: new Date().toISOString() };
    return updated;
  });
  writeList(KEY, next);
  return updated;
}

export function deleteCustomer(id: string): void {
  writeList(KEY, listCustomers().filter((c) => c.id !== id));
}
