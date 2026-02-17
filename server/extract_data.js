const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function extractData() {
  const client = await pool.connect();
  try {
    const projects = await client.query('SELECT * FROM projects ORDER BY display_order ASC');
    const skills = await client.query('SELECT * FROM skills ORDER BY display_order ASC');
    const experience = await client.query('SELECT * FROM experience ORDER BY display_order ASC');
    const education = await client.query('SELECT * FROM education ORDER BY display_order ASC');
    const services = await client.query('SELECT * FROM services ORDER BY display_order ASC');
    const about = await client.query('SELECT * FROM about LIMIT 1');

    const data = {
      projects: projects.rows,
      skills: skills.rows,
      experience: experience.rows,
      education: education.rows,
      services: services.rows,
      about: about.rows[0]
    };

    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error extracting data:', err);
  } finally {
    client.release();
    pool.end();
  }
}

extractData();