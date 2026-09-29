const express = require('express');
const router = express.Router();
const Visitor = require('../models/Visitor');
const { verifyToken, authorizeRoles } = require('../middleware/authMiddleware');

// Require authentication for all visitor routes
router.use(verifyToken);

// Add a new visitor (Admin & Receptionist)
router.post('/', async (req, res) => {
  try {
    const { name, mobileNumber, companyName, personToMeet, purpose } = req.body;
    const newVisitor = new Visitor({ name, mobileNumber, companyName, personToMeet, purpose });
    const savedVisitor = await newVisitor.save();
    res.status(201).json(savedVisitor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all visitors (Admin & Receptionist)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { mobileNumber: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const visitors = await Visitor.find(query).sort({ date: -1 });
    res.json(visitors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get dashboard stats (Admin & Receptionist)
router.get('/dashboard', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayCount = await Visitor.countDocuments({
      date: { $gte: today }
    });
    const totalCount = await Visitor.countDocuments();

    res.json({ todayCount, totalCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update visitor (Admin & Receptionist)
router.put('/:id', async (req, res) => {
  try {
    const updatedVisitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedVisitor) return res.status(404).json({ message: 'Visitor not found' });
    res.json(updatedVisitor);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete visitor (ADMIN ONLY)
router.delete('/:id', authorizeRoles('admin'), async (req, res) => {
  try {
    const deletedVisitor = await Visitor.findByIdAndDelete(req.params.id);
    if (!deletedVisitor) return res.status(404).json({ message: 'Visitor not found' });
    res.json({ message: 'Visitor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
