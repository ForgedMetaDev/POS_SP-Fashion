const authService = require('../services/authService');

const login = async (req, res, next) => {
  try {
    // Sample payload:
    // {
    //   "username": "admin",
    //   "password": "admin123"
    // }
    const data = await authService.login(req.body);
    return res.status(200).json({ message: 'Login successful', data });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  login
};
