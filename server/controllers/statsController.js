const Stats = require('../models/statsModel');

exports.getStats = async (req, res, next) => {
    try {
        const stats = await Stats.getStats();
        res.status(200).json({ success: true, data: stats });
    } catch (err) {
        next(err);
    }
};

exports.incrementHit = async (req, res, next) => {
    try {
        await Stats.incrementHit();
        res.status(200).json({ success: true, message: 'Hit incremented' });
    } catch (err) {
        next(err);
    }
};
