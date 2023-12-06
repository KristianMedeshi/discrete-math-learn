const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const getFullPath = require('../utils/getFullPath');

const SECRET = process.env.JWT_SECRET;

module.exports.signUp = async (req, res) => {
  const { email, password, name } = req.body;
  const existingUser = await User.findOne({ email }, { _id: true }).lean();
  if (existingUser) {
    return res.status(400).json({ error: 'User with the same email already exists' });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await User.create({
    email,
    password: hashedPassword,
    name,
  });
  res.status(201).json({ message: 'User has been created successfully' });
};

module.exports.signIn = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }, { password: true, _id: true }).lean();
  if (!user) {
    return res.status(401).json({ error: 'Wrong name or password' });
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ error: 'Wrong name or password' });
  }
  const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: '24h' });
  res.status(200).json({ token, userId: user._id });
};

module.exports.getMyInfo = async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id).select('-password -courses').lean();
  delete user._id;
  delete user.__v;
  user.fullName = `${user.firstName} ${user.lastName}`;
  user.image = getFullPath(req, user.image);
  res.status(200).json({ user });
};

module.exports.updateMyInfo = async (req, res) => {
  const { id } = req.user;
  const data = req.body;
  const user = await User.findById(id);
  if (req.file) {
    data.image = req.file.path;
  }
  if (data?.currentPassword && data?.newPassword) {
    if (!bcrypt.compare(data.currentPassword, user.password)) {
      return res.status(401).json({ message: 'Password does not match' });
    }
    user.password = data.newPassword;
    await user.validate();
    data.password = await bcrypt.hash(data.newPassword, 10);
  }
  await user.updateOne(data);
  res.status(200).json({ message: 'User has been updated successfully' });
};
