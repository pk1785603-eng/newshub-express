const express = require('express');
const { pool } = require('../config/database');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// GET /api/live - Get live stream settings (public)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM live_settings WHERE id = 1');
    
    if (rows.length === 0) {
      return res.json({
        is_live: false,
        live_video_id: '',
        live_url: '',
        live_title: 'LIVE NOW: 24x7 News Time',
        channel_id: ''
      });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Get live settings error:', error);
    res.status(500).json({ error: 'Failed to fetch live settings' });
  }
});

// PUT /api/live - Update live stream settings (admin only)
router.put('/', verifyToken, async (req, res) => {
  try {
    const { channel_id, live_video_id, live_url, is_live, live_title } = req.body;

    // Check if settings exist
    const [existing] = await pool.query('SELECT id FROM live_settings WHERE id = 1');
    
    if (existing.length === 0) {
      // Insert new settings
      await pool.query(`
        INSERT INTO live_settings (id, channel_id, live_video_id, live_url, is_live, live_title)
        VALUES (1, ?, ?, ?, ?, ?)
      `, [channel_id || '', live_video_id || '', live_url || '', is_live || false, live_title || 'LIVE NOW: 24x7 News Time']);
    } else {
      // Update existing settings
      await pool.query(`
        UPDATE live_settings SET
          channel_id = ?, live_video_id = ?, live_url = ?,
          is_live = ?, live_title = ?, updated_at = NOW()
        WHERE id = 1
      `, [channel_id || '', live_video_id || '', live_url || '', is_live || false, live_title || 'LIVE NOW: 24x7 News Time']);
    }

    res.json({ message: 'Live settings updated successfully' });
  } catch (error) {
    console.error('Update live settings error:', error);
    res.status(500).json({ error: 'Failed to update live settings' });
  }
});

// POST /api/live/go-live - Quick toggle to go live (admin only)
router.post('/go-live', verifyToken, async (req, res) => {
  try {
    const { video_id, title } = req.body;

    await pool.query(`
      UPDATE live_settings SET
        live_video_id = ?, is_live = TRUE,
        live_title = ?, updated_at = NOW()
      WHERE id = 1
    `, [video_id || '', title || 'LIVE NOW: 24x7 News Time']);

    res.json({ message: 'You are now live!' });
  } catch (error) {
    console.error('Go live error:', error);
    res.status(500).json({ error: 'Failed to go live' });
  }
});

// POST /api/live/end-live - End live stream (admin only)
router.post('/end-live', verifyToken, async (req, res) => {
  try {
    await pool.query(`
      UPDATE live_settings SET is_live = FALSE, updated_at = NOW()
      WHERE id = 1
    `);

    res.json({ message: 'Live stream ended' });
  } catch (error) {
    console.error('End live error:', error);
    res.status(500).json({ error: 'Failed to end live' });
  }
});

module.exports = router;
