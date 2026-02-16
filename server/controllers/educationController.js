const Education = require('../models/educationModel');

exports.getEducation = async (req, res, next) => {
    try {
        const data = await Education.findAll();
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.createEducation = async (req, res, next) => {
    try {
        const data = await Education.create(req.body);
        res.status(201).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.updateEducation = async (req, res, next) => {
    try {
        const data = await Education.update(req.params.id, req.body);
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.deleteEducation = async (req, res, next) => {
    try {
        await Education.delete(req.params.id);
        res.status(200).json({ success: true, message: 'Education deleted' });
    } catch (err) {
        next(err);
    }
};
