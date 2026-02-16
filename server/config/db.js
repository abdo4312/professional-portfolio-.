const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const initDb = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Projects Table
    await client.query(`CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      long_description TEXT,
      tech_stack TEXT NOT NULL, 
      image TEXT,
      gallery TEXT, -- JSON string
      github_url TEXT,
      live_url TEXT,
      category TEXT,
      is_featured BOOLEAN DEFAULT FALSE,
      display_order INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // 2. Contacts Table (Inbox)
    await client.query(`CREATE TABLE IF NOT EXISTS contacts (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT,
      message TEXT NOT NULL,
      is_read BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // 3. Users Table (Admin)
    await client.query(`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )`);

    // 4. Skills Table
    await client.query(`CREATE TABLE IF NOT EXISTS skills (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      proficiency INTEGER DEFAULT 0,
      icon TEXT,
      display_order INTEGER DEFAULT 0
    )`);

    // 5. About Table
    await client.query(`CREATE TABLE IF NOT EXISTS about (
      id SERIAL PRIMARY KEY,
      name_en TEXT,
      name_ar TEXT,
      title_en TEXT,
      title_ar TEXT,
      short_bio_en TEXT,
      short_bio_ar TEXT,
      about_en TEXT,
      about_ar TEXT,
      image_url TEXT,
      cv_url TEXT,
      email TEXT,
      phone TEXT,
      address_en TEXT,
      address_ar TEXT,
      social_links TEXT -- JSON string
    )`);

    // 6. Experience Table
    await client.query(`CREATE TABLE IF NOT EXISTS experience (
      id SERIAL PRIMARY KEY,
      title_en TEXT NOT NULL,
      title_ar TEXT NOT NULL,
      company_en TEXT NOT NULL,
      company_ar TEXT NOT NULL,
      location_en TEXT,
      location_ar TEXT,
      period_en TEXT NOT NULL,
      period_ar TEXT NOT NULL,
      description_en TEXT,
      description_ar TEXT,
      display_order INTEGER DEFAULT 0
    )`);

    // 7. Education Table
    await client.query(`CREATE TABLE IF NOT EXISTS education (
      id SERIAL PRIMARY KEY,
      degree_en TEXT NOT NULL,
      degree_ar TEXT NOT NULL,
      institution_en TEXT NOT NULL,
      institution_ar TEXT NOT NULL,
      period_en TEXT NOT NULL,
      period_ar TEXT NOT NULL,
      description_en TEXT,
      description_ar TEXT,
      display_order INTEGER DEFAULT 0
    )`);

    // 8. Services Table
    await client.query(`CREATE TABLE IF NOT EXISTS services (
      id SERIAL PRIMARY KEY,
      title_en TEXT NOT NULL,
      title_ar TEXT NOT NULL,
      description_en TEXT NOT NULL,
      description_ar TEXT NOT NULL,
      icon TEXT,
      display_order INTEGER DEFAULT 0
    )`);

    // 9. Stats Table
    await client.query(`CREATE TABLE IF NOT EXISTS stats (
      id SERIAL PRIMARY KEY,
      page_hits INTEGER DEFAULT 0,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // 10. Settings Table
    await client.query(`CREATE TABLE IF NOT EXISTS settings (
      id SERIAL PRIMARY KEY,
      site_title_en TEXT,
      site_title_ar TEXT,
      site_description_en TEXT,
      site_description_ar TEXT,
      keywords_en TEXT,
      keywords_ar TEXT,
      google_analytics_id TEXT
    )`);

    // --- SEEDING ---

    // Seed Admin User
    const userRes = await client.query("SELECT count(*) FROM users");
    if (parseInt(userRes.rows[0].count) === 0) {
      console.log("Seeding admin user...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("Gaara2001", salt);
      await client.query("INSERT INTO users (username, password) VALUES ($1, $2)", ["Abdo", hashedPassword]);
    }

    // Seed About
    const aboutRes = await client.query("SELECT count(*) FROM about");
    if (parseInt(aboutRes.rows[0].count) === 0) {
      console.log("Seeding about content...");
      await client.query(`INSERT INTO about (
        name_en, name_ar, title_en, title_ar, 
        short_bio_en, short_bio_ar, about_en, about_ar,
        image_url, email
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, [
        "Admin", "المسؤول", "Full Stack Developer", "مطور ويب شامل",
        "Passionate about building great software.", "شغوف ببناء برمجيات رائعة.",
        "I am a software engineer with a focus on modern web technologies.", "أنا مهندس برمجيات أركز على تقنيات الويب الحديثة.",
        "https://picsum.photos/600/600?random=10", "admin@example.com"
      ]);
    }

    // Seed Stats
    const statsRes = await client.query("SELECT count(*) FROM stats");
    if (parseInt(statsRes.rows[0].count) === 0) {
      console.log("Seeding stats...");
      await client.query("INSERT INTO stats (page_hits) VALUES (0)");
    }

    // Seed Settings
    const settingsRes = await client.query("SELECT count(*) FROM settings");
    if (parseInt(settingsRes.rows[0].count) === 0) {
      console.log("Seeding settings...");
      await client.query(`INSERT INTO settings (
        site_title_en, site_title_ar, 
        site_description_en, site_description_ar
      ) VALUES ($1, $2, $3, $4)`, [
        "Professional Portfolio", "معرض الأعمال الاحترافي",
        "My professional portfolio showcasing projects and skills.", "معرض أعمالي الاحترافي الذي يعرض مشاريعي ومهاراتي."
      ]);
    }

    await client.query('COMMIT');
    console.log('Database initialized successfully.');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error initializing database:', err.message);
  } finally {
    client.release();
  }
};

initDb();

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};