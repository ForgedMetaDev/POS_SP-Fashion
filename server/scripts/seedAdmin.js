require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const User = require('../src/models/User');
const ROLES = require('../src/constants/roles');

const getArgValue = (flag) => {
  const index = process.argv.indexOf(flag);
  if (index === -1) {
    return undefined;
  }

  return process.argv[index + 1];
};

const seedAdmin = async () => {
  const fullName = getArgValue('--name') || process.env.ADMIN_NAME;
  const usernameRaw = getArgValue('--username') || process.env.ADMIN_USERNAME;
  const password = getArgValue('--password') || process.env.ADMIN_PASSWORD;

  if (!fullName || !usernameRaw || !password) {
    throw new Error(
      'Missing required admin values. Pass --name --username --password or set ADMIN_NAME, ADMIN_USERNAME, ADMIN_PASSWORD in .env'
    );
  }

  const username = usernameRaw.toLowerCase();

  await connectDB();

  const existing = await User.findOne({ username });

  if (existing) {
    existing.fullName = fullName;
    existing.role = ROLES.ADMIN;
    existing.isActive = true;
    existing.password = password;
    await existing.save();

    console.log(`Admin user updated: ${username}`);
    return;
  }

  await User.create({
    fullName,
    username,
    password,
    role: ROLES.ADMIN,
    isActive: true
  });

  console.log(`Admin user created: ${username}`);
};

seedAdmin()
  .then(async () => {
    await mongoose.connection.close();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('Failed to seed admin user:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  });
