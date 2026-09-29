const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken, JWT_SECRET } = require('../middleware/authMiddleware');

// Seed default accounts for manual login
const seedDefaultUsers = async () => {
  try {
    const adminExists = await User.findOne({ username: 'admin' });
    if (!adminExists) {
      await User.create({
        username: 'admin',
        password: 'adminpassword',
        name: 'System Admin',
        role: 'admin',
      });
      console.log('Seeded default Admin user (admin / adminpassword)');
    }

    const visitorExists = await User.findOne({ username: 'visitor' });
    if (!visitorExists) {
      await User.create({
        username: 'visitor',
        password: 'visitorpassword',
        name: 'Front Desk Visitor',
        role: 'visitor',
      });
      console.log('Seeded default Visitor user (visitor / visitorpassword)');
    }
  } catch (error) {
    console.error('Error seeding default users:', error.message);
  }
};

// Standard Manual Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role, name: user.name, avatarUrl: user.avatarUrl },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during authentication.' });
  }
});



// Get Current User Profile
router.get('/me', verifyToken, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = {
  router,
  seedDefaultUsers,
};
