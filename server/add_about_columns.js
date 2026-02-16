const { pool } = require('./config/db');

const addColumns = async () => {
  const client = await pool.connect();
  try {
    console.log('Adding new columns to about table...');
    
    await client.query('ALTER TABLE about ADD COLUMN IF NOT EXISTS freelance_status_en TEXT;');
    await client.query('ALTER TABLE about ADD COLUMN IF NOT EXISTS freelance_status_ar TEXT;');
    await client.query('ALTER TABLE about ADD COLUMN IF NOT EXISTS work_status_en TEXT;');
    await client.query('ALTER TABLE about ADD COLUMN IF NOT EXISTS work_status_ar TEXT;');
    
    console.log('Columns added successfully.');
  } catch (err) {
    console.error('Error adding columns:', err);
  } finally {
    client.release();
    // pool.end() might be called by db.js or not exposed properly to close? 
    // db.js exports pool, so we can close it.
    // But since initDb runs on require, we might need to be careful.
    // Let's just exit process.
    process.exit(0);
  }
};

addColumns();
