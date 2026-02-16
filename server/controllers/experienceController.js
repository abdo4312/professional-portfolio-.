const Experience = require('../models/experienceModel');

exports.getExperience = async (req, res, next) => {
    try {
        const data = await Experience.findAll();
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.createExperience = async (req, res, next) => {
    try {
        const data = await Experience.create(req.body);
        res.status(201).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.updateExperience = async (req, res, next) => {
    try {
        const data = await Experience.update(req.params.id, req.body);
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.deleteExperience = async (req, res, next) => {
    try {
        await Experience.delete(req.params.id);
        res.status(200).json({ success: true, message: 'Experience deleted' });
    } catch (err) {
        next(err);
    }
};
