import { useState } from 'react';
import { createDoc, deleteDoc, listDocs } from '../data/docs';
import type { Doc, NewDoc } from '../types/doc';

export function useDocs() {
  const [docs, setDocs] = useState<Doc[]>(() => listDocs());

  const refresh = () => setDocs(listDocs());

  const add = (input: NewDoc) => {
    createDoc(input);
    refresh();
  };

  const removeAllForCustomer = (customerId: string) => {
    for (const doc of listDocs().filter((d) => d.customerId === customerId)) {
      deleteDoc(doc.id);
    }
    refresh();
  };

  return { docs, add, removeAllForCustomer, refresh };
}
