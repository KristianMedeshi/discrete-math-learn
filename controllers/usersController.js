const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const getFullPath = require('../utils/getFullPath');

const SECRET = process.env.JWT_SECRET;

module.exports.signUp = async (req, res) => {
  try {
    const { email, password, name } = req.body;
    const existingUser = await User.findOne({ email }, { _id: true }).lean();
    if (existingUser) {
      return res.status(400).json({ error: 'User with the same email already exists' });
    }
    const newUser = new User({
      email,
      password,
      name,
    });
    await newUser.validate();
    newUser.password = await bcrypt.hash(password, 10);
    await newUser.save();
    res.status(201).json({ message: 'User has been created successfully' });
  } catch (error) {
    console.error('Sign up error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

module.exports.signIn = async (req, res) => {
  try {
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
    res.status(200).json({ token });
  } catch (error) {
    console.error('Sign in error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

module.exports.getMyInfo = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);
    user.image = getFullPath(req, user.image);
    res.status(200).json({ user });
  } catch (error) {
    console.error('Get my info error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};

module.exports.updateMyInfo = async (req, res) => {
  try {
    const { id } = req.user;
    const data = JSON.parse(req.body.jsonData);
    const user = await User.findById(id);
    const newImage = req.file;
    delete data.image;
    if (newImage) {
      data.image = newImage.path;
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
  } catch (error) {
    console.error('Update my info error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
};
