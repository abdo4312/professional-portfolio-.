const Project = require('../models/projectModel');

exports.getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.findAll();
    res.status(200).json({ success: true, data: projects });
  } catch (err) {
    next(err);
  }
};

exports.getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    res.status(200).json({ success: true, data: project });
  } catch (err) {
    next(err);
  }
};

exports.createProject = async (req, res, next) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }
    const newProject = await Project.create(req.body);
    res.status(201).json({ success: true, data: newProject });
  } catch (err) {
    next(err);
  }
};

exports.updateProject = async (req, res, next) => {
  try {
    await Project.update(req.params.id, req.body);
    res.status(200).json({ success: true, message: 'Project updated' });
  } catch (err) {
    next(err);
  }
};

exports.deleteProject = async (req, res, next) => {
  try {
    await Project.delete(req.params.id);
    res.status(200).json({ success: true, message: 'Project deleted' });
  } catch (err) {
    next(err);
  }
};