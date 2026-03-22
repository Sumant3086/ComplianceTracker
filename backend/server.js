const express = require('express');
const cors = require('cors');
const { initDb } = require('./models/dbStore');

const clientsRouter = require('./routes/clients');
const tasksRouter = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize DB file
initDb();

// Routes
app.use('/api/clients', clientsRouter);
app.use('/api/tasks', tasksRouter);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong on the server' });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
