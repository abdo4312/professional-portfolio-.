const Service = require('../models/serviceModel');

exports.getServices = async (req, res, next) => {
    try {
        const data = await Service.findAll();
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.createService = async (req, res, next) => {
    try {
        const data = await Service.create(req.body);
        res.status(201).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.updateService = async (req, res, next) => {
    try {
        const data = await Service.update(req.params.id, req.body);
        res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

exports.deleteService = async (req, res, next) => {
    try {
        await Service.delete(req.params.id);
        res.status(200).json({ success: true, message: 'Service deleted' });
    } catch (err) {
        next(err);
    }
};
