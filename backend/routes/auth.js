const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// POST /api/auth/login - Admin login
router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Verify password against stored hash
    const storedHash = process.env.ADMIN_PASSWORD_HASH;
    
    if (!storedHash) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    const isValid = await bcrypt.compare(password, storedHash);
    
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { role: 'admin', timestamp: Date.now() },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      expiresIn: 86400 // 24 hours in seconds
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// POST /api/auth/verify - Verify token
router.post('/verify', (req, res) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valid: true });
  } catch (error) {
    res.status(401).json({ valid: false });
  }
});

// Utility endpoint to generate password hash (use once, then remove)
router.post('/generate-hash', async (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ error: 'Password required' });
  }
  const hash = await bcrypt.hash(password, 10);
  res.json({ hash, note: 'Copy this hash to your .env ADMIN_PASSWORD_HASH' });
});

module.exports = router;
