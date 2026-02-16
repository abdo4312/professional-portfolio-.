const db = require('../config/db');

const Settings = {
    get: async () => {
        const res = await db.query("SELECT * FROM settings LIMIT 1");
        return res.rows[0];
    },

    update: async (data) => {
        const {
            site_title_en, site_title_ar,
            site_description_en, site_description_ar,
            keywords_en, keywords_ar,
            google_analytics_id
        } = data;

        const sql = `
            UPDATE settings SET 
                site_title_en = $1, site_title_ar = $2,
                site_description_en = $3, site_description_ar = $4,
                keywords_en = $5, keywords_ar = $6,
                google_analytics_id = $7
            WHERE id = (SELECT id FROM settings LIMIT 1)
        `;

        const params = [
            site_title_en, site_title_ar,
            site_description_en, site_description_ar,
            keywords_en, keywords_ar,
            google_analytics_id
        ];

        await db.query(sql, params);
        return data;
    },

    exportAll: async () => {
        const data = {};
        const tables = ['about', 'projects', 'skills', 'experience', 'education', 'services', 'contacts', 'stats', 'settings'];

        for (const table of tables) {
            const res = await db.query(`SELECT * FROM ${table}`);
            data[table] = res.rows;
        }

        return data;
    }
};

module.exports = Settings;
