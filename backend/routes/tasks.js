const express = require('express');
const crypto = require('crypto');
const Task = require('../models/Task');
const Client = require('../models/Client');

const router = express.Router();

// Format helper
const formatTask = (t) => ({
    id: t.id,
    client_id: t.client_id,
    title: t.title,
    description: t.description,
    category: t.category,
    due_date: t.due_date,
    status: t.status,
    priority: t.priority
});

// GET tasks for a specific client
router.get('/client/:clientId', async (req, res) => {
    try {
        const tasks = await Task.find({ client_id: req.params.clientId });
        res.json(tasks.map(formatTask));
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving tasks' });
    }
});

// GET all tasks
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find({});
        res.json(tasks.map(formatTask));
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving tasks' });
    }
});

// CREATE a new task
router.post('/', async (req, res) => {
    try {
        const { client_id, title, description, category, due_date, status, priority } = req.body;

        // Basic validation
        if (!client_id || !title || !category || !due_date || !status) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Ensure client exists
        const client = await Client.findOne({ id: client_id });
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        const newTask = new Task({
            id: crypto.randomUUID(),
            client_id,
            title,
            description: description || '',
            category,
            due_date,
            status,
            priority: priority || 'Medium'
        });

        await newTask.save();
        res.status(201).json(formatTask(newTask));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating task' });
    }
});

// UPDATE task status / details
router.put('/:id', async (req, res) => {
    try {
        const updates = req.body;

        // Find and update natively in Mongo
        const task = await Task.findOneAndUpdate(
            { id: req.params.id },
            { $set: updates },
            { new: true } // Return updated doc
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json(formatTask(task));
    } catch (error) {
        res.status(500).json({ message: 'Error updating task' });
    }
});

// DELETE a task
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ id: req.params.id });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting task' });
    }
});

module.exports = router;
