const About = require('../models/aboutModel');

exports.getAbout = async (req, res, next) => {
  try {
    const about = await About.get();
    res.status(200).json({ success: true, data: about });
  } catch (err) {
    next(err);
  }
};

exports.updateAbout = async (req, res, next) => {
  try {
    const updated = await About.update(req.body);
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};