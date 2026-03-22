const express = require('express');
const Client = require('../models/Client');

const router = express.Router();

// GET all clients
router.get('/', async (req, res) => {
    try {
        const clients = await Client.find({});
        // Mapping _id back to id to match frontend expectation
        const formattedClients = clients.map(c => ({
            id: c.id,
            company_name: c.company_name,
            country: c.country,
            entity_type: c.entity_type
        }));
        res.json(formattedClients);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving clients' });
    }
});

// GET single client
router.get('/:id', async (req, res) => {
    try {
        const client = await Client.findOne({ id: req.params.id });
        if (!client) return res.status(404).json({ message: 'Client not found' });
        res.json({
            id: client.id,
            company_name: client.company_name,
            country: client.country,
            entity_type: client.entity_type
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
