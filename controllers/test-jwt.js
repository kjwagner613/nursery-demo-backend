const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/sign-token', (req, res) => {
  const user = {
    _id: 1,
    username: 'test'
  };

  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ error: 'JWT_SECRET is not defined in .env file.' });
  }

  const payload = {
    userId: user._id,
    username: user.username
  };

  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

  res.json({ token });
});

router.post('/verify-token', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or malformed.' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ decoded });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token.' });
  }
});

module.exports = router;
