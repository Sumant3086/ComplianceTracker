import React, { useState, useEffect } from 'react';
import { getClients, getTasks, createTask, updateTask, deleteTask } from './api';
import ClientList from './components/ClientList';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import { LayoutDashboard, Plus } from 'lucide-react';

function App() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      fetchTasks(selectedClient.id);
      setShowTaskForm(false);
    }
  }, [selectedClient]);

  const fetchClients = async () => {
    try {
      const data = await getClients();
      setClients(data);
      if (data.length > 0) {
        setSelectedClient(data[0]);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchTasks = async (clientId) => {
    try {
      const data = await getTasks(clientId);
      setTasks(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      const newTask = await createTask(taskData);
      setTasks([...tasks, newTask]);
      setShowTaskForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleStatus = async (task) => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    try {
      const updated = await updateTask(task.id, { status: newStatus });
      setTasks(tasks.map(t => t.id === updated.id ? updated : t));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center bg-gray-50 text-xl font-medium text-gray-500">Loading Compliance Tracker...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden">
      {/* Sidebar: Clients */}
      <ClientList
        clients={clients}
        selectedClient={selectedClient}
        onSelectClient={setSelectedClient}
      />

      {/* Main Content: Tasks */}
      <div className="flex-1 flex flex-col h-full bg-gray-50">
        <header className="bg-white border-b px-6 py-4 flex justify-between items-center shadow-sm z-10">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="text-indigo-600" />
            <h1 className="text-xl font-bold text-gray-800">Compliance Tracker</h1>
            {selectedClient && (
              <span className="ml-4 text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                {selectedClient.company_name}
              </span>
            )}
          </div>

          {selectedClient && !showTaskForm && (
            <button
              onClick={() => setShowTaskForm(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
            >
              <Plus size={18} /> New Task
            </button>
          )}
        </header>

        <main className="flex-1 flex flex-col overflow-hidden">
          {showTaskForm && (
            <TaskForm
              clientId={selectedClient.id}
              onTaskAdded={handleAddTask}
              onCancel={() => setShowTaskForm(false)}
            />
          )}

          {selectedClient ? (
            <TaskList
              tasks={tasks}
              onToggleStatus={handleToggleStatus}
              onDeleteTask={handleDeleteTask}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Select a client to view tasks
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
