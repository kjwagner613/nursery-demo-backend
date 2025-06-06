const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

const saltRounds = 12;

// User registration
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    const userInDatabase = await User.findOne({ email });
    if (userInDatabase) {
      return res.status(409).json({ error: 'Email already registered.' });
    }
    const hashedPassword = bcrypt.hashSync(password, saltRounds);
    const user = await User.create({
      firstName,
      lastName,
      email,
      hashedPassword
    });
    const payload = { firstName: user.firstName, lastName: user.lastName, email: user.email, _id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ token, user: payload });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const isPasswordCorrect = bcrypt.compareSync(password, user.hashedPassword);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const payload = { firstName: user.firstName, lastName: user.lastName, email: user.email, _id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, user: payload });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
