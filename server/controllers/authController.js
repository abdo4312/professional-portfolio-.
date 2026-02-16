const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await User.findByUsername(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        success: true,
        token: generateToken(user.id, user.username),
        user: { id: user.id, username: user.username }
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  const { newPassword } = req.body;
  try {
    await User.updatePassword(req.user.id, newPassword);
    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    // In a stateless JWT system, logout is handled client-side
    // by removing the token from localStorage
    // This endpoint can be used for server-side token blacklisting if needed
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

const generateToken = (id, username) => {
  return jwt.sign({ id, username }, process.env.JWT_SECRET || 'secret_key_123', {
    expiresIn: '30d',
  });
};