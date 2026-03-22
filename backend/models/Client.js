const mongoose = require('mongoose');

const clientSchema = new mongoose.Schema({
    company_name: { type: String, required: true },
    country: { type: String, required: true },
    entity_type: { type: String, required: true },
});

module.exports = mongoose.model('Client', clientSchema);
