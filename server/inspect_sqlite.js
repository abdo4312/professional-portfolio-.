const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../portfolio.db');
const db = new sqlite3.Database(dbPath);

console.log('Inspecting SQLite Schema...');

db.serialize(() => {
    db.all("SELECT name, sql FROM sqlite_master WHERE type='table'", (err, rows) => {
        if (err) {
            console.error('Error fetching schema:', err);
            process.exit(1);
        }
        rows.forEach(row => {
            console.log('--- TABLE:', row.name, '---');
            console.log(row.sql);
            console.log('---------------------------');
        });
        db.close();
    });
});
