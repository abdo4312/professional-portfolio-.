const db = require('../config/db');

const Stats = {
    getStats: async () => {
        const res = await db.query("SELECT page_hits FROM stats LIMIT 1");
        return res.rows[0];
    },

    incrementHit: async () => {
        await db.query("UPDATE stats SET page_hits = page_hits + 1, last_updated = CURRENT_TIMESTAMP WHERE id = (SELECT id FROM stats LIMIT 1)");
        return { success: true };
    }
};

module.exports = Stats;
