const express = require('express');
const { readDb } = require('../models/dbStore');

const router = express.Router();

// GET all clients
router.get('/', (req, res) => {
    try {
        const db = readDb();
        res.json(db.clients);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving clients' });
    }
});

// GET single client
router.get('/:id', (req, res) => {
    try {
        const db = readDb();
        const client = db.clients.find(c => c.id === req.params.id);
        if (!client) return res.status(404).json({ message: 'Client not found' });
        res.json(client);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
