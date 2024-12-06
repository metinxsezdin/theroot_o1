const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const db = require('../models');

const SECRET_KEY = 'your_jwt_secret'; // Store securely in an environment variable

// User Registration
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await db.Personnel.findOne({ where: { email } });
    if (existingUser) return res.status(400).json({ message: 'Email already in use' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.Personnel.create({ name, email, password: hashedPassword });

    res.status(201).json({ message: 'User registered', user: newUser });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// User Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.Personnel.findOne({ where: { email } });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Şifrenin mevcut olduğundan emin olun
    if (!user.password) {
      return res.status(400).json({ message: 'User password is missing in the database' });
    }

    // Şifre karşılaştırması
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Token oluştur
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Current User
router.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await db.Personnel.findByPk(decoded.id, { attributes: { exclude: ['password'] } });
    res.json(user);
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
