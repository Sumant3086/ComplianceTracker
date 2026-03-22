const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    client_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    due_date: { type: Date, required: true },
    status: { type: String, default: 'Pending' },
    priority: { type: String, default: 'Medium' }
});

module.exports = mongoose.model('Task', taskSchema);
