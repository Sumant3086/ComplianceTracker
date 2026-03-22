require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const clientsRouter = require('./routes/clients');
const tasksRouter = require('./routes/tasks');
const Client = require('./models/Client');
const Task = require('./models/Task');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/compliancetracker';
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async () => {
    console.log('Connected to MongoDB');
    await seedDatabase();
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Seed data if empty
async function seedDatabase() {
    try {
        const clientCount = await Client.countDocuments();
        if (clientCount === 0) {
            console.log('Seeding initial clients and tasks...');
            const seedData = require('./data/seed.json'); // Reusing seed data
            await Client.insertMany(seedData.clients);
            await Task.insertMany(seedData.tasks);
            console.log('Database seeded!');
        }
    } catch (e) {
        console.error('Error seeding data:', e);
    }
}

// Routes
app.use('/api/clients', clientsRouter);
app.use('/api/tasks', tasksRouter);

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Backend is running on MongoDB' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong on the server' });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
