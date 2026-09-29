const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const { verifyToken, JWT_SECRET } = require('../middleware/authMiddleware');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'dummy_client_id');

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

    const receptionistExists = await User.findOne({ username: 'receptionist' });
    if (!receptionistExists) {
      await User.create({
        username: 'receptionist',
        password: 'receptionpassword',
        name: 'Front Desk Receptionist',
        role: 'receptionist',
      });
      console.log('Seeded default Receptionist user (receptionist / receptionpassword)');
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

// Google Auth Route
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: 'Google credential is required.' });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID || 'dummy_client_id',
    });

    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture: avatarUrl } = payload;

    let user = await User.findOne({ googleId });

    if (!user) {
      const count = await User.countDocuments();
      const role = count === 0 ? 'admin' : 'receptionist';

      user = await User.create({
        googleId,
        email: email.toLowerCase(),
        name,
        avatarUrl,
        role,
      });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name, avatarUrl: user.avatarUrl },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
        avatarUrl: user.avatarUrl,
      },
    });
  } catch (error) {
    console.error('Google Auth Error:', error.message);
    res.status(500).json({ message: 'Server error during Google authentication.' });
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
