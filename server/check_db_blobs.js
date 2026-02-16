
const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function checkBlobs() {
  try {
    console.log('Checking for blob URLs in database...');

    // Check projects image
    const projectsImage = await pool.query("SELECT id, title, image FROM projects WHERE image LIKE 'blob:%'");
    if (projectsImage.rows.length > 0) {
      console.log('Found projects with blob image:', projectsImage.rows);
    } else {
      console.log('No projects with blob image found.');
    }

    // Check projects gallery
    const projectsGallery = await pool.query("SELECT id, title, gallery FROM projects WHERE gallery LIKE '%blob:%'");
    if (projectsGallery.rows.length > 0) {
      console.log('Found projects with blob gallery:', projectsGallery.rows);
    } else {
      console.log('No projects with blob gallery found.');
    }

    // Check about image_url
    const aboutImage = await pool.query("SELECT id, image_url FROM about WHERE image_url LIKE 'blob:%'");
    if (aboutImage.rows.length > 0) {
      console.log('Found about with blob image_url:', aboutImage.rows);
    } else {
      console.log('No about with blob image_url found.');
    }

    // Check about cv_url
    const aboutCv = await pool.query("SELECT id, cv_url FROM about WHERE cv_url LIKE 'blob:%'");
    if (aboutCv.rows.length > 0) {
      console.log('Found about with blob cv_url:', aboutCv.rows);
    } else {
      console.log('No about with blob cv_url found.');
    }

  } catch (err) {
    console.error('Error checking database:', err);
  } finally {
    await pool.end();
  }
}

checkBlobs();
