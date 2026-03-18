const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: '1d'
  });

const login = async ({ username, password }) => {
  const user = await User.findOne({ username: username.toLowerCase() });

  if (!user || !user.isActive) {
    throw new Error('Invalid credentials or inactive user');
  }

  const isPasswordMatch = await user.comparePassword(password);
  if (!isPasswordMatch) {
    throw new Error('Invalid credentials');
  }

  return {
    token: generateToken(user._id, user.role),
    user: {
      id: user._id,
      fullName: user.fullName,
      username: user.username,
      role: user.role,
      isActive: user.isActive
    }
  };
};

module.exports = {
  login
};
