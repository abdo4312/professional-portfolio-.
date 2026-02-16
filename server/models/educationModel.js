const db = require('../config/db');

const Education = {
    findAll: async () => {
        const res = await db.query("SELECT * FROM education ORDER BY display_order ASC, period_en DESC");
        return res.rows;
    },

    create: async (data) => {
        const {
            degree_en, degree_ar, institution_en, institution_ar,
            period_en, period_ar, description_en, description_ar, displayOrder
        } = data;

        const sql = `
            INSERT INTO education (
                degree_en, degree_ar, institution_en, institution_ar, 
                period_en, period_ar, description_en, description_ar, display_order
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id
        `;
        const params = [
            degree_en, degree_ar, institution_en, institution_ar,
            period_en, period_ar, description_en, description_ar, displayOrder || 0
        ];

        const res = await db.query(sql, params);
        return { id: res.rows[0].id, ...data };
    },

    update: async (id, data) => {
        const {
            degree_en, degree_ar, institution_en, institution_ar,
            period_en, period_ar, description_en, description_ar, displayOrder
        } = data;

        const sql = `
            UPDATE education SET 
                degree_en = $1, degree_ar = $2, institution_en = $3, institution_ar = $4, 
                period_en = $5, period_ar = $6, description_en = $7, description_ar = $8, display_order = $9
            WHERE id = $10
        `;
        const params = [
            degree_en, degree_ar, institution_en, institution_ar,
            period_en, period_ar, description_en, description_ar, displayOrder || 0, id
        ];

        await db.query(sql, params);
        return { id, ...data };
    },

    delete: async (id) => {
        await db.query("DELETE FROM education WHERE id = $1", [id]);
        return { id };
    }
};

module.exports = Education;
