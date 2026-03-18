const userService = require('../services/userService');

const createUser = async (req, res, next) => {
  try {
    // Sample payload:
    // {
    //   "fullName": "Worker One",
    //   "username": "worker1",
    //   "password": "worker123",
    //   "role": "worker"
    // }
    const user = await userService.createUser(req.body);
    return res.status(201).json({ message: 'User created successfully', data: user });
  } catch (error) {
    return next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json({ data: users });
  } catch (error) {
    return next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    return res.status(200).json({ message: 'User updated successfully', data: user });
  } catch (error) {
    return next(error);
  }
};

const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await userService.toggleUserStatus(req.params.id);
    return res.status(200).json({ message: 'User status updated', data: user });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createUser,
  getUsers,
  updateUser,
  toggleUserStatus
};
