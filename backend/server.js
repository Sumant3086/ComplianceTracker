require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const Client = require('./models/Client');
const Task = require('./models/Task');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/compliance_tracker';

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        // Seed initial clients if empty
        const count = await Client.countDocuments();
        if (count === 0) {
            await Client.insertMany([
                { company_name: 'Acme Corp', country: 'USA', entity_type: 'LLC' },
                { company_name: 'Global Ventures', country: 'UK', entity_type: 'Corporation' }
            ]);
            console.log('Seeded initial clients');
        }
    })
    .catch(err => console.error('MongoDB connection error:', err));

// --- API ROUTES ---

// Get all clients
app.get('/api/clients', async (req, res) => {
    try {
        const clients = await Client.find();
        res.json(clients);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch clients' });
    }
});

// Get tasks for a client
app.get('/api/clients/:clientId/tasks', async (req, res) => {
    try {
        const tasks = await Task.find({ client_id: req.params.clientId });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch tasks' });
    }
});

// Create a task
app.post('/api/tasks', async (req, res) => {
    try {
        const task = new Task(req.body);
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: 'Failed to create task' });
    }
});

// Update a task status
app.patch('/api/tasks/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update task' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
