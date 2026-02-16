const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  findByUsername: async (username) => {
    const res = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    return res.rows[0];
  },

  updatePassword: async (id, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = 'UPDATE users SET password = $1 WHERE id = $2';
    await db.query(sql, [hashedPassword, id]);
    return true;
  }
};

module.exports = User;