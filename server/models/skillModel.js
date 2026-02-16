const db = require('../config/db');

const Skill = {
  findAll: async () => {
    const res = await db.query("SELECT * FROM skills ORDER BY display_order ASC, proficiency DESC");
    return res.rows;
  },

  create: async (skill) => {
    const { name, category, proficiency, icon, displayOrder } = skill;
    const sql = "INSERT INTO skills (name, category, proficiency, icon, display_order) VALUES ($1, $2, $3, $4, $5) RETURNING id";
    const res = await db.query(sql, [name, category, proficiency || 0, icon, displayOrder || 0]);
    return { id: res.rows[0].id, ...skill };
  },

  update: async (id, skill) => {
    const { name, category, proficiency, icon, displayOrder } = skill;
    const sql = "UPDATE skills SET name = $1, category = $2, proficiency = $3, icon = $4, display_order = $5 WHERE id = $6";
    await db.query(sql, [name, category, proficiency || 0, icon, displayOrder || 0, id]);
    return { id, ...skill };
  },

  delete: async (id) => {
    await db.query("DELETE FROM skills WHERE id = $1", [id]);
    return { id };
  }
};

module.exports = Skill;