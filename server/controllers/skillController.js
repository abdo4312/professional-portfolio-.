const Skill = require('../models/skillModel');

exports.getSkills = async (req, res, next) => {
  try {
    const skills = await Skill.findAll();
    res.status(200).json({ success: true, data: skills });
  } catch (err) {
    next(err);
  }
};

exports.createSkill = async (req, res, next) => {
  try {
    const newSkill = await Skill.create(req.body);
    res.status(201).json({ success: true, data: newSkill });
  } catch (err) {
    next(err);
  }
};

exports.updateSkill = async (req, res, next) => {
  try {
    await Skill.update(req.params.id, req.body);
    res.status(200).json({ success: true, message: 'Skill updated' });
  } catch (err) {
    next(err);
  }
};

exports.deleteSkill = async (req, res, next) => {
  try {
    await Skill.delete(req.params.id);
    res.status(200).json({ success: true, message: 'Skill deleted' });
  } catch (err) {
    next(err);
  }
};