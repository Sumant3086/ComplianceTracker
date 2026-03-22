const fs = require('fs');
const path = require('path');

const DB_FILE = path.join(__dirname, '../data/db.json');
const SEED_FILE = path.join(__dirname, '../data/seed.json');

// Initialize DB with seed if empty or missing
function initDb() {
    if (!fs.existsSync(DB_FILE)) {
        const seedData = fs.readFileSync(SEED_FILE, 'utf-8');
        fs.writeFileSync(DB_FILE, seedData);
    } else {
        // If empty, put in seed data
        try {
            const dbStr = fs.readFileSync(DB_FILE, 'utf-8');
            if (!dbStr || dbStr.trim() === '') throw new Error('Empty');
            JSON.parse(dbStr);
        } catch (err) {
            const seedData = fs.readFileSync(SEED_FILE, 'utf-8');
            fs.writeFileSync(DB_FILE, seedData);
        }
    }
}

function readDb() {
    try {
        const data = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (err) {
        return { clients: [], tasks: [] };
    }
}

function writeDb(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

module.exports = { initDb, readDb, writeDb };
