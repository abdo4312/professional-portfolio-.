const Settings = require('../models/settingsModel');

exports.getSettings = async (req, res, next) => {
    try {
        const settings = await Settings.get();
        res.status(200).json({ success: true, data: settings });
    } catch (err) {
        next(err);
    }
};

exports.updateSettings = async (req, res, next) => {
    try {
        const updated = await Settings.update(req.body);
        res.status(200).json({ success: true, data: updated });
    } catch (err) {
        next(err);
    }
};

exports.exportData = async (req, res, next) => {
    try {
        const data = await Settings.exportAll();
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};
