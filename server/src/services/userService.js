const User = require('../models/User');

const createUser = async (payload) => {
  const existingUser = await User.findOne({ username: payload.username.toLowerCase() });
  if (existingUser) {
    throw new Error('Username already exists');
  }

  const user = await User.create({
    ...payload,
    username: payload.username.toLowerCase()
  });

  return {
    id: user._id,
    fullName: user.fullName,
    username: user.username,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt
  };
};

const getAllUsers = async () =>
  User.find().select('-password').sort({ createdAt: -1 });

const updateUser = async (id, payload) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found');
  }

  if (payload.username) {
    const normalizedUsername = payload.username.toLowerCase();
    const existingUser = await User.findOne({
      _id: { $ne: id },
      username: normalizedUsername
    });

    if (existingUser) {
      throw new Error('Username already exists');
    }

    user.username = normalizedUsername;
  }

  if (payload.fullName !== undefined) user.fullName = payload.fullName;
  if (payload.role !== undefined) user.role = payload.role;
  if (payload.password !== undefined) user.password = payload.password;

  await user.save();

  return {
    id: user._id,
    fullName: user.fullName,
    username: user.username,
    role: user.role,
    isActive: user.isActive,
    updatedAt: user.updatedAt
  };
};

const toggleUserStatus = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found');
  }

  user.isActive = !user.isActive;
  await user.save();

  return {
    id: user._id,
    isActive: user.isActive
  };
};

module.exports = {
  createUser,
  getAllUsers,
  updateUser,
  toggleUserStatus
};
