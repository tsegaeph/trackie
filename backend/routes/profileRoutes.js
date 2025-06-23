const express = require('express');
const multer = require('multer');
const path = require('path');
const User = require('../models/User');
const router = express.Router();

// Multer setup: store uploaded images in 'uploads' folder
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this folder exists and is writable
  },
  filename: function (req, file, cb) {
    // Use Date.now() + original name to avoid collisions
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Accept only image files
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg' && ext !== '.gif') {
      return cb(new Error('Only images are allowed'));
    }
    cb(null, true);
  },
  limits: { fileSize: 5 * 1024 * 1024 } // limit 5MB
});

// Get user profile by id (exclude password)
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error('Get profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile by id
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { name, email } = req.body;
    const updateData = { name, email };

    if (req.file) {
      // Save relative path for frontend access
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error('Update profile error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
