const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const db = require('./config/db');

const checkAbout = async () => {
  try {
    const res = await db.query("SELECT * FROM about");
    console.log('About Table Rows:', res.rows);
  } catch (err) {
    console.error('Error querying about table:', err);
  }
};

checkAbout();
