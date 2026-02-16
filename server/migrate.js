const sqlite3 = require('sqlite3').verbose();
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config();

const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

const initSupabase = async () => {
    const client = await pgPool.connect();
    try {
        await client.query('BEGIN');
        // Standard Schema (PostgreSQL)
        await client.query(`CREATE TABLE IF NOT EXISTS projects (id SERIAL PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL, long_description TEXT, tech_stack TEXT NOT NULL, image TEXT, gallery TEXT, github_url TEXT, live_url TEXT, category TEXT, is_featured BOOLEAN DEFAULT FALSE, display_order INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
        await client.query(`CREATE TABLE IF NOT EXISTS contacts (id SERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, subject TEXT, message TEXT NOT NULL, is_read BOOLEAN DEFAULT FALSE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
        await client.query(`CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL)`);
        await client.query(`CREATE TABLE IF NOT EXISTS skills (id SERIAL PRIMARY KEY, name TEXT NOT NULL, category TEXT NOT NULL, proficiency INTEGER DEFAULT 0, icon TEXT, display_order INTEGER DEFAULT 0)`);
        await client.query(`CREATE TABLE IF NOT EXISTS about (id SERIAL PRIMARY KEY, name_en TEXT, name_ar TEXT, title_en TEXT, title_ar TEXT, short_bio_en TEXT, short_bio_ar TEXT, about_en TEXT, about_ar TEXT, image_url TEXT, cv_url TEXT, email TEXT, phone TEXT, address_en TEXT, address_ar TEXT, social_links TEXT)`);
        await client.query(`CREATE TABLE IF NOT EXISTS experience (id SERIAL PRIMARY KEY, title_en TEXT NOT NULL, title_ar TEXT NOT NULL, company_en TEXT NOT NULL, company_ar TEXT NOT NULL, location_en TEXT, location_ar TEXT, period_en TEXT NOT NULL, period_ar TEXT NOT NULL, description_en TEXT, description_ar TEXT, display_order INTEGER DEFAULT 0)`);
        await client.query(`CREATE TABLE IF NOT EXISTS education (id SERIAL PRIMARY KEY, degree_en TEXT NOT NULL, degree_ar TEXT NOT NULL, institution_en TEXT NOT NULL, institution_ar TEXT NOT NULL, period_en TEXT NOT NULL, period_ar TEXT NOT NULL, description_en TEXT, description_ar TEXT, display_order INTEGER DEFAULT 0)`);
        await client.query(`CREATE TABLE IF NOT EXISTS services (id SERIAL PRIMARY KEY, title_en TEXT NOT NULL, title_ar TEXT NOT NULL, description_en TEXT NOT NULL, description_ar TEXT NOT NULL, icon TEXT, display_order INTEGER DEFAULT 0)`);
        await client.query(`CREATE TABLE IF NOT EXISTS stats (id SERIAL PRIMARY KEY, page_hits INTEGER DEFAULT 0, last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
        await client.query(`CREATE TABLE IF NOT EXISTS settings (id SERIAL PRIMARY KEY, site_title_en TEXT, site_title_ar TEXT, site_description_en TEXT, site_description_ar TEXT, keywords_en TEXT, keywords_ar TEXT, google_analytics_id TEXT)`);
        await client.query('COMMIT');
        console.log('Supabase schema initialized.');
    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error initializing schema:', err);
    } finally {
        client.release();
    }
};

const sqliteDbPath = path.resolve(__dirname, '../portfolio.db');
const sqliteDb = new sqlite3.Database(sqliteDbPath);

const getSqliteTables = async () => {
    return new Promise((resolve, reject) => {
        sqliteDb.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
            if (err) reject(err);
            else resolve(rows.map(r => r.name));
        });
    });
};

const migrate = async () => {
    await initSupabase();

    const sqliteTables = await getSqliteTables();
    console.log('Tables found in SQLite:', sqliteTables);

    const tablesToMigrate = [
        'users', 'about', 'projects', 'skills', 'experience',
        'education', 'services', 'contacts', 'stats', 'settings'
    ];

    for (const table of tablesToMigrate) {
        if (!sqliteTables.includes(table)) {
            console.log(`Skipping table ${table} (not in SQLite).`);
            continue;
        }

        console.log(`Migrating table: ${table}...`);

        const rows = await new Promise((resolve, reject) => {
            sqliteDb.all(`SELECT * FROM ${table}`, [], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });

        if (rows.length === 0) {
            console.log(`Table ${table} is empty. Skipping.`);
            continue;
        }

        const client = await pgPool.connect();
        try {
            await client.query('BEGIN');
            await client.query(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE`);

            // Get columns for this table in Supabase
            const colRes = await client.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = $1
            `, [table]);
            const pgColumns = colRes.rows.map(r => r.column_name);

            for (const row of rows) {
                const dataToInsert = {};

                // Map columns based on source row
                Object.keys(row).forEach(col => {
                    let targetCol = col;
                    // CamelCase to snake_case mappings
                    if (col === 'longDescription') targetCol = 'long_description';
                    if (col === 'techStack') targetCol = 'tech_stack';
                    if (col === 'githubUrl') targetCol = 'github_url';
                    if (col === 'liveUrl') targetCol = 'live_url';
                    if (col === 'isFeatured') targetCol = 'is_featured';
                    if (col === 'displayOrder') targetCol = 'display_order';
                    if (col === 'createdAt') targetCol = 'created_at';
                    if (col === 'isRead') targetCol = 'is_read';
                    if (col === 'imageUrl') targetCol = 'image_url';
                    if (col === 'cvUrl') targetCol = 'cv_url';
                    if (col === 'content' && table === 'about') targetCol = 'about_en'; // Simple mapping
                    if (col === 'level' && table === 'skills') targetCol = 'proficiency'; // Placeholder mapping

                    if (pgColumns.includes(targetCol)) {
                        let val = row[col];
                        // Type conversions if needed
                        if (targetCol === 'proficiency' && typeof val === 'string') {
                            val = val.toLowerCase().includes('expert') ? 90 : 70;
                        }
                        dataToInsert[targetCol] = val;
                    }
                });

                const cols = Object.keys(dataToInsert);
                const vals = Object.values(dataToInsert);
                const placeholders = cols.map((_, i) => `$${i + 1}`).join(', ');

                const sql = `INSERT INTO ${table} (${cols.join(', ')}) VALUES (${placeholders})`;
                await client.query(sql, vals);
            }

            await client.query('COMMIT');
            console.log(`Successfully migrated ${rows.length} rows into ${table}.`);
        } catch (err) {
            await client.query('ROLLBACK');
            console.error(`Error migrating table ${table}:`, err.message);
        } finally {
            client.release();
        }
    }

    console.log('Migration step complete. Now ensuring seeded data exists for new tables...');
    // I could add seeding here, but db.js will do it when the server starts.
    // However, for immediate usability, let's trigger it.

    sqliteDb.close();
    await pgPool.end();
    console.log('Migration process finished.');
};

migrate().catch(err => console.error('Migration overall failure:', err));
