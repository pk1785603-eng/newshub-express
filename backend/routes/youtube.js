const express = require('express');
const { pool } = require('../config/database');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// GET /api/youtube - Get all YouTube videos (public)
router.get('/', async (req, res) => {
  try {
    const { category, limit = 20 } = req.query;
    
    let query = 'SELECT * FROM youtube_videos WHERE is_live = FALSE';
    const params = [];

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }

    query += ' ORDER BY display_order ASC, created_at DESC LIMIT ?';
    params.push(parseInt(limit));

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Get YouTube videos error:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

// POST /api/youtube - Add YouTube video (admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { video_id, title, description, thumbnail, category, views, display_order } = req.body;

    // Auto-generate thumbnail if not provided
    const thumbUrl = thumbnail || `https://img.youtube.com/vi/${video_id}/maxresdefault.jpg`;

    const [result] = await pool.query(`
      INSERT INTO youtube_videos (video_id, title, description, thumbnail, category, views, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      video_id,
      title,
      description || '',
      thumbUrl,
      category || 'general',
      views || '0',
      display_order || 0
    ]);

    res.status(201).json({ id: result.insertId, message: 'Video added successfully' });
  } catch (error) {
    console.error('Add YouTube video error:', error);
    res.status(500).json({ error: 'Failed to add video' });
  }
});

// PUT /api/youtube/:id - Update YouTube video (admin only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { video_id, title, description, thumbnail, category, views, display_order } = req.body;

    await pool.query(`
      UPDATE youtube_videos SET
        video_id = ?, title = ?, description = ?, thumbnail = ?,
        category = ?, views = ?, display_order = ?, updated_at = NOW()
      WHERE id = ?
    `, [video_id, title, description, thumbnail, category, views, display_order, req.params.id]);

    res.json({ message: 'Video updated successfully' });
  } catch (error) {
    console.error('Update YouTube video error:', error);
    res.status(500).json({ error: 'Failed to update video' });
  }
});

// DELETE /api/youtube/:id - Delete YouTube video (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM youtube_videos WHERE id = ?', [req.params.id]);
    res.json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Delete YouTube video error:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
});

module.exports = router;
