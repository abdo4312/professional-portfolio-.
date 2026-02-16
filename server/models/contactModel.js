const db = require('../config/db');

const Contact = {
  create: async (contact) => {
    const { name, email, subject, message } = contact;
    const sql = `INSERT INTO contacts (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING id`;
    const res = await db.query(sql, [name, email, subject, message]);
    return { id: res.rows[0].id, ...contact };
  },

  findAll: async () => {
    const res = await db.query("SELECT * FROM contacts ORDER BY created_at DESC");
    return res.rows.map(row => ({
      ...row,
      isRead: row.is_read // mapping for frontend
    }));
  },

  update: async (id, contact) => {
    const { isRead } = contact;
    const sql = `UPDATE contacts SET is_read = $1 WHERE id = $2`;
    await db.query(sql, [!!isRead, id]);
    return { id, ...contact };
  },

  delete: async (id) => {
    await db.query("DELETE FROM contacts WHERE id = $1", [id]);
    return { id };
  }
};

module.exports = Contact;