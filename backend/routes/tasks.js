const express = require('express');
const { readDb, writeDb } = require('../models/dbStore');
const crypto = require('crypto');

const router = express.Router();

// GET tasks for a specific client
router.get('/client/:clientId', (req, res) => {
    try {
        const db = readDb();
        const clientTasks = db.tasks.filter(t => t.client_id === req.params.clientId);
        res.json(clientTasks);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving tasks' });
    }
});

// GET all tasks (optional, useful for debugging)
router.get('/', (req, res) => {
    try {
        const db = readDb();
        res.json(db.tasks);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving tasks' });
    }
});

// CREATE a new task
router.post('/', (req, res) => {
    try {
        const { client_id, title, description, category, due_date, status, priority } = req.body;

        // Basic validation
        if (!client_id || !title || !category || !due_date || !status) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const db = readDb();

        // Ensure client exists
        if (!db.clients.some(c => c.id === client_id)) {
            return res.status(404).json({ message: 'Client not found' });
        }

        const newTask = {
            id: crypto.randomUUID(),
            client_id,
            title,
            description: description || '',
            category,
            due_date,
            status,
            priority: priority || 'Medium'
        };

        db.tasks.push(newTask);
        writeDb(db);

        res.status(201).json(newTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating task' });
    }
});

// UPDATE task status / details
router.put('/:id', (req, res) => {
    try {
        const db = readDb();
        const taskIndex = db.tasks.findIndex(t => t.id === req.params.id);

        if (taskIndex === -1) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Update only allowed fields sent in request
        const updates = req.body;
        const task = db.tasks[taskIndex];

        if (updates.title) task.title = updates.title;
        if (updates.description !== undefined) task.description = updates.description;
        if (updates.category) task.category = updates.category;
        if (updates.due_date) task.due_date = updates.due_date;
        if (updates.status) task.status = updates.status;
        if (updates.priority) task.priority = updates.priority;

        db.tasks[taskIndex] = task;
        writeDb(db);

        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Error updating task' });
    }
});

// DELETE a task
router.delete('/:id', (req, res) => {
    try {
        const db = readDb();
        const taskIndex = db.tasks.findIndex(t => t.id === req.params.id);

        if (taskIndex === -1) {
            return res.status(404).json({ message: 'Task not found' });
        }

        db.tasks.splice(taskIndex, 1);
        writeDb(db);

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task' });
    }
});

module.exports = router;
