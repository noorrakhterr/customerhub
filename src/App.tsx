import { useState } from 'react';
import { AppHeader } from './components/layout/AppHeader';
import { CustomerCockpitSection } from './components/customers/CustomerCockpitSection';
import { CustomerDetailPanel } from './components/customers/CustomerDetailPanel';
import { AgendaPanel } from './components/agenda/AgendaPanel';
import { QuickNotes } from './components/agenda/QuickNotes';
import { useCustomers } from './hooks/useCustomers';
import { useTasks } from './hooks/useTasks';
import { useMeetings } from './hooks/useMeetings';
import { useDocs } from './hooks/useDocs';
import { useNotes } from './hooks/useNotes';
import type { NewCustomer } from './types/customer';

export default function App() {
  const { customers, add: addCustomer, edit: editCustomer, remove: removeCustomer } = useCustomers();
  const {
    tasks,
    add: addTask,
    edit: editTask,
    remove: removeTask,
    removeAllForCustomer: removeAllTasksForCustomer,
    createInitialTask,
    markCustomerResponded,
    addClosureLogEntry,
    toggleComplete,
  } = useTasks();
  const { meetings, add: addMeeting } = useMeetings();
  const { docs, add: addDoc, removeAllForCustomer: removeAllDocsForCustomer } = useDocs();
  const { notes, add: addNote, remove: removeNote } = useNotes();

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId) ?? null;

  const handleAddCustomer = (input: NewCustomer) => {
    const customer = addCustomer(input);
    createInitialTask(customer.id);
  };

  const handleDeleteCustomer = (id: string) => {
    removeCustomer(id);
    removeAllTasksForCustomer(id);
    removeAllDocsForCustomer(id);
  };

  const handleCloseCustomer = (id: string, reason: string) => {
    addClosureLogEntry(id, reason);
    editCustomer(id, { closed: true });
  };

  return (
    <div className="app">
      <AppHeader />

      <div className="app-layout">
        <CustomerCockpitSection
          customers={customers}
          tasks={tasks}
          onSelectCustomer={setSelectedCustomerId}
          onAddCustomer={handleAddCustomer}
          onDeleteCustomer={handleDeleteCustomer}
        />

        <div className="sidebar-stack">
          <AgendaPanel
            tasks={tasks}
            meetings={meetings}
            customers={customers}
            onAddMeeting={addMeeting}
          />
          <QuickNotes notes={notes} onAdd={addNote} onDelete={removeNote} />
        </div>
      </div>

      {selectedCustomer && (
        <CustomerDetailPanel
          customer={selectedCustomer}
          tasks={tasks}
          docs={docs}
          onClose={() => setSelectedCustomerId(null)}
          onUpdateCustomer={editCustomer}
          onDeleteCustomer={handleDeleteCustomer}
          onAddTask={addTask}
          onEditTask={editTask}
          onDeleteTask={removeTask}
          onToggleTaskComplete={toggleComplete}
          onMarkCustomerResponded={markCustomerResponded}
          onCloseCustomer={handleCloseCustomer}
          onAddDoc={addDoc}
        />
      )}
    </div>
  );
}
