const Contact = require('../models/contactModel');

exports.submitContact = async (req, res, next) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'All fields required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email' });
    }

    const newContact = await Contact.create({ name, email, subject, message });
    res.status(201).json({ success: true, message: 'Message sent!', data: newContact });
  } catch (err) {
    next(err);
  }
};

exports.getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.findAll();
    res.status(200).json({ success: true, data: contacts });
  } catch (err) {
    next(err);
  }
};

exports.updateContactStatus = async (req, res, next) => {
  try {
    await Contact.update(req.params.id, req.body);
    res.status(200).json({ success: true, message: 'Message status updated' });
  } catch (err) {
    next(err);
  }
};

exports.deleteContact = async (req, res, next) => {
  try {
    await Contact.delete(req.params.id);
    res.status(200).json({ success: true, message: 'Message deleted' });
  } catch (err) {
    next(err);
  }
};