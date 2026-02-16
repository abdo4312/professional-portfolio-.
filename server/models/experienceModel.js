const db = require('../config/db');

const Experience = {
    findAll: async () => {
        const res = await db.query("SELECT * FROM experience ORDER BY display_order ASC, period_en DESC");
        return res.rows;
    },

    create: async (data) => {
        const {
            title_en, title_ar, company_en, company_ar,
            location_en, location_ar, period_en, period_ar,
            description_en, description_ar, displayOrder
        } = data;

        const sql = `
            INSERT INTO experience (
                title_en, title_ar, company_en, company_ar, 
                location_en, location_ar, period_en, period_ar, 
                description_en, description_ar, display_order
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
            RETURNING id
        `;
        const params = [
            title_en, title_ar, company_en, company_ar,
            location_en, location_ar, period_en, period_ar,
            description_en, description_ar, displayOrder || 0
        ];

        const res = await db.query(sql, params);
        return { id: res.rows[0].id, ...data };
    },

    update: async (id, data) => {
        const {
            title_en, title_ar, company_en, company_ar,
            location_en, location_ar, period_en, period_ar,
            description_en, description_ar, displayOrder
        } = data;

        const sql = `
            UPDATE experience SET 
                title_en = $1, title_ar = $2, company_en = $3, company_ar = $4, 
                location_en = $5, location_ar = $6, period_en = $7, period_ar = $8, 
                description_en = $9, description_ar = $10, display_order = $11
            WHERE id = $12
        `;
        const params = [
            title_en, title_ar, company_en, company_ar,
            location_en, location_ar, period_en, period_ar,
            description_en, description_ar, displayOrder || 0, id
        ];

        await db.query(sql, params);
        return { id, ...data };
    },

    delete: async (id) => {
        await db.query("DELETE FROM experience WHERE id = $1", [id]);
        return { id };
    }
};

module.exports = Experience;
