const db = require('../config/db');

const About = {
  get: async () => {
    const res = await db.query("SELECT * FROM about LIMIT 1");
    const row = res.rows[0];
    if (row) {
      // Mapping snake_case back to what frontend expects if needed, 
      // but let's see if we should just keep it snake_case.
      // Actually, my Hero/About components used data.imageUrl etc.
      // So I should probably map them here or update frontend.
      // Better to map here to maintain frontend compatibility.
      return {
        ...row,
        imageUrl: row.image_url,
        cvUrl: row.cv_url,
        freelance_status_en: row.freelance_status_en,
        freelance_status_ar: row.freelance_status_ar,
        work_status_en: row.work_status_en,
        work_status_ar: row.work_status_ar
      };
    }
    return row;
  },

  update: async (data) => {
    const {
      name_en, name_ar, title_en, title_ar,
      short_bio_en, short_bio_ar, about_en, about_ar,
      imageUrl, cvUrl, email, phone, address_en, address_ar,
      social_links,
      freelance_status_en, freelance_status_ar,
      work_status_en, work_status_ar
    } = data;

    const sql = `
      UPDATE about SET 
        name_en = $1, name_ar = $2, title_en = $3, title_ar = $4,
        short_bio_en = $5, short_bio_ar = $6, about_en = $7, about_ar = $8,
        image_url = $9, cv_url = $10, email = $11, phone = $12, 
        address_en = $13, address_ar = $14, social_links = $15,
        freelance_status_en = $16, freelance_status_ar = $17,
        work_status_en = $18, work_status_ar = $19
      WHERE id = (SELECT id FROM about LIMIT 1)
    `;

    const params = [
      name_en, name_ar, title_en, title_ar,
      short_bio_en, short_bio_ar, about_en, about_ar,
      imageUrl, cvUrl, email, phone, address_en, address_ar,
      social_links,
      freelance_status_en, freelance_status_ar,
      work_status_en, work_status_ar
    ];

    await db.query(sql, params);
    return data;
  }
};

module.exports = About;