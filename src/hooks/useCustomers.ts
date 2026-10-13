import { useState } from 'react';
import {
  createCustomer,
  deleteCustomer,
  listCustomers,
  updateCustomer,
} from '../data/customers';
import type { Customer, NewCustomer } from '../types/customer';

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>(() => listCustomers());

  const refresh = () => setCustomers(listCustomers());

  const add = (input: NewCustomer): Customer => {
    const customer = createCustomer(input);
    refresh();
    return customer;
  };

  const edit = (id: string, patch: Partial<NewCustomer>) => {
    updateCustomer(id, patch);
    refresh();
  };

  const remove = (id: string) => {
    deleteCustomer(id);
    refresh();
  };

  return { customers, add, edit, remove, refresh };
}
