import { useState, useEffect } from 'react';
import './index.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const defaultClients = [
  { _id: '1', company_name: 'Acme Corp', country: 'USA', entity_type: 'LLC' },
  { _id: '2', company_name: 'Global Ventures', country: 'UK', entity_type: 'Corporation' }
];

const defaultTasks = [
  { _id: 't1', client_id: '1', title: 'File Q1 Taxes', category: 'Tax', due_date: new Date(Date.now() - 86400000).toISOString(), status: 'Pending', priority: 'High' },
  { _id: 't2', client_id: '1', title: 'Annual Report Filing', category: 'Filing', due_date: new Date(Date.now() + 86400000 * 5).toISOString(), status: 'Completed', priority: 'Medium' }
];

function App() {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [useLocalDB, setUseLocalDB] = useState(false);

  // Filters
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');

  // New Task Form
  const [newTask, setNewTask] = useState({ title: '', description: '', category: 'Tax', due_date: '', priority: 'Medium' });

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      fetchTasks(selectedClient._id);
    }
  }, [selectedClient, useLocalDB]);

  const loadLocalClients = () => {
    const local = localStorage.getItem('compliance_clients');
    if (local) return JSON.parse(local);
    localStorage.setItem('compliance_clients', JSON.stringify(defaultClients));
    return defaultClients;
  };

  const loadLocalTasks = () => {
    const local = localStorage.getItem('compliance_tasks');
    if (local) return JSON.parse(local);
    localStorage.setItem('compliance_tasks', JSON.stringify(defaultTasks));
    return defaultTasks;
  };

  const saveLocalTasks = (newTasks) => {
    localStorage.setItem('compliance_tasks', JSON.stringify(newTasks));
    setTasks(newTasks.filter(t => t.client_id === selectedClient?._id));
  };

  const fetchClients = async () => {
    try {
      const res = await fetch(`${API_URL}/clients`);
      const data = await res.json();
      setClients(data);
      if (data.length > 0) setSelectedClient(data[0]);
    } catch (e) {
      console.warn('Backend not reachable, falling back to LocalStorage DB.');
      setUseLocalDB(true);
      const data = loadLocalClients();
      setClients(data);
      if (data.length > 0) setSelectedClient(data[0]);
    }
  };

  const fetchTasks = async (clientId) => {
    if (useLocalDB) {
      const allTasks = loadLocalTasks();
      setTasks(allTasks.filter(t => t.client_id === clientId));
      return;
    }
    try {
      const res = await fetch(`${API_URL}/clients/${clientId}/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (e) {
      // Fallback already handled
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!selectedClient || !newTask.title || !newTask.due_date) return;

    const taskPayload = { ...newTask, client_id: selectedClient._id, status: 'Pending' };

    if (useLocalDB) {
      const allTasks = loadLocalTasks();
      const newT = { ...taskPayload, _id: Date.now().toString() };
      saveLocalTasks([...allTasks, newT]);
      setNewTask({ title: '', description: '', category: 'Tax', due_date: '', priority: 'Medium' });
      return;
    }

    try {
      const res = await fetch(`${API_URL}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskPayload)
      });
      if (res.ok) {
        setNewTask({ title: '', description: '', category: 'Tax', due_date: '', priority: 'Medium' });
        fetchTasks(selectedClient._id);
      }
    } catch (e) {
      console.error('Failed to create task');
    }
  };

  const updateTaskStatus = async (taskId, currentStatus) => {
    const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';

    if (useLocalDB) {
      const allTasks = loadLocalTasks();
      saveLocalTasks(allTasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
      return;
    }

    try {
      const res = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setTasks(tasks.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
      }
    } catch (e) {
      console.error('Failed to update task');
    }
  };

  const isOverdue = (task) => {
    if (task.status === 'Completed') return false;
    return new Date(task.due_date) < new Date(new Date().setHours(0, 0, 0, 0));
  };

  const filteredTasks = tasks.filter(task => {
    const statusMatch = filterStatus === 'All' || task.status === filterStatus;
    const catMatch = filterCategory === 'All' || task.category === filterCategory;
    return statusMatch && catMatch;
  });

  const uniqueCategories = ['All', ...new Set(tasks.map(t => t.category).filter(Boolean))];
  const formCategories = ['Tax', 'Filing', 'Audit', 'General'];

  return (
    <div className="container">
      <div className="card">
        <h2>Clients {useLocalDB && <span style={{ fontSize: '0.8rem', color: 'var(--warning)' }}>(Offline Mode)</span>}</h2>
        <ul className="client-list">
          {clients.map(c => (
            <li
              key={c._id}
              className={`client-item ${selectedClient?._id === c._id ? 'active' : ''}`}
              onClick={() => setSelectedClient(c)}
            >
              <strong>{c.company_name}</strong>
              <p style={{ fontSize: '0.85rem', color: 'inherit' }}>{c.entity_type} • {c.country}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2>Tasks for {selectedClient?.company_name || '...'}</h2>

        <form className="task-form" onSubmit={handleCreateTask}>
          <h3>Add New Task</h3>
          <div className="form-group">
            <input type="text" placeholder="Title" value={newTask.title} onChange={e => setNewTask({ ...newTask, title: e.target.value })} required />
          </div>
          <div className="form-group" style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem' }}>
            <select value={newTask.category} onChange={e => setNewTask({ ...newTask, category: e.target.value })}>
              {formCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input type="date" value={newTask.due_date} onChange={e => setNewTask({ ...newTask, due_date: e.target.value })} required />
            <select value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <button type="submit">Add Task</button>
        </form>

        <div className="filters">
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
          <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="task-list">
          {filteredTasks.length === 0 ? <p>No tasks found.</p> : null}
          {filteredTasks.map(task => (
            <div key={task._id} className={`task-card ${isOverdue(task) ? 'overdue' : ''}`}>
              <div>
                <strong>{task.title}</strong>
                <div className="task-meta">
                  <span className={`badge ${task.status.toLowerCase()}`}>{task.status}</span>
                  <span className="badge" style={{ background: '#e2e8f0', color: '#334155' }}>{task.category}</span>
                  <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
                  <span className="badge" style={{ background: '#e0e7ff', color: '#3730a3' }}>{task.priority} Priority</span>
                </div>
              </div>
              <button
                className={task.status === 'Pending' ? 'success' : ''}
                onClick={() => updateTaskStatus(task._id, task.status)}
              >
                Mark {task.status === 'Pending' ? 'Complete' : 'Pending'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
