const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    client_id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, required: true },
    due_date: { type: String, required: true },
    status: { type: String, required: true, enum: ['Pending', 'Completed'] },
    priority: { type: String, default: 'Medium' }
});

module.exports = mongoose.model('Task', taskSchema);
