const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    company_name: { type: String, required: true },
    country: { type: String },
    entity_type: { type: String }
});

module.exports = mongoose.model('Client', clientSchema);
