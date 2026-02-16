const db = require('../config/db');

const Service = {
    findAll: async () => {
        const res = await db.query("SELECT * FROM services ORDER BY display_order ASC");
        return res.rows;
    },

    create: async (data) => {
        const { title_en, title_ar, description_en, description_ar, icon, displayOrder } = data;
        const sql = `
            INSERT INTO services (title_en, title_ar, description_en, description_ar, icon, display_order)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `;
        const res = await db.query(sql, [title_en, title_ar, description_en, description_ar, icon, displayOrder || 0]);
        return { id: res.rows[0].id, ...data };
    },

    update: async (id, data) => {
        const { title_en, title_ar, description_en, description_ar, icon, displayOrder } = data;
        const sql = `
            UPDATE services SET title_en = $1, title_ar = $2, description_en = $3, description_ar = $4, icon = $5, display_order = $6
            WHERE id = $7
        `;
        await db.query(sql, [title_en, title_ar, description_en, description_ar, icon, displayOrder || 0, id]);
        return { id, ...data };
    },

    delete: async (id) => {
        await db.query("DELETE FROM services WHERE id = $1", [id]);
        return { id };
    }
};

module.exports = Service;
