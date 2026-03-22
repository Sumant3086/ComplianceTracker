import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

export const getClients = async () => {
    const { data } = await api.get('/clients');
    return data;
};

export const getClient = async (id) => {
    const { data } = await api.get(`/clients/${id}`);
    return data;
};

export const getTasks = async (clientId) => {
    const { data } = await api.get(`/tasks/client/${clientId}`);
    return data;
};

export const createTask = async (taskData) => {
    const { data } = await api.post('/tasks', taskData);
    return data;
};

export const updateTask = async (taskId, updates) => {
    const { data } = await api.put(`/tasks/${taskId}`, updates);
    return data;
};
