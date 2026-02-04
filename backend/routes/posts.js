const express = require('express');
const { pool } = require('../config/database');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// GET /api/posts - Get all posts (public)
router.get('/', async (req, res) => {
  try {
    const { category, featured, limit = 50, offset = 0, search } = req.query;
    
    let query = `
      SELECT p.*, c.name as category_name, c.slug as category_slug, c.color as category_color,
             a.name as author_name, a.avatar as author_avatar
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN authors a ON p.author_id = a.id
      WHERE p.is_published = TRUE
    `;
    const params = [];

    if (category) {
      query += ` AND c.slug = ?`;
      params.push(category);
    }

    if (featured === 'true') {
      query += ` AND p.is_featured = TRUE`;
    }

    if (search) {
      query += ` AND (p.title LIKE ? OR p.excerpt LIKE ? OR p.content LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    query += ` ORDER BY p.publish_date DESC LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), parseInt(offset));

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// GET /api/posts/trending - Get trending posts
router.get('/trending', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug, c.color as category_color
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.is_published = TRUE
      ORDER BY p.views DESC
      LIMIT 5
    `);
    res.json(rows);
  } catch (error) {
    console.error('Get trending error:', error);
    res.status(500).json({ error: 'Failed to fetch trending posts' });
  }
});

// GET /api/posts/:slug - Get single post
router.get('/:slug', async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, c.name as category_name, c.slug as category_slug, c.color as category_color,
             a.name as author_name, a.avatar as author_avatar, a.bio as author_bio
      FROM posts p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN authors a ON p.author_id = a.id
      WHERE p.slug = ?
    `, [req.params.slug]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Increment view count
    await pool.query('UPDATE posts SET views = views + 1 WHERE slug = ?', [req.params.slug]);

    res.json(rows[0]);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Failed to fetch post' });
  }
});

// POST /api/posts - Create new post (admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    const {
      title, slug, excerpt, content, featured_image,
      category_id, author_id, tags, keywords, youtube_id,
      is_featured, is_published, publish_date
    } = req.body;

    const [result] = await pool.query(`
      INSERT INTO posts (title, slug, excerpt, content, featured_image, category_id, author_id, tags, keywords, youtube_id, is_featured, is_published, publish_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      title,
      slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      excerpt,
      content,
      featured_image,
      category_id || 1,
      author_id || 1,
      JSON.stringify(tags || []),
      JSON.stringify(keywords || []),
      youtube_id || null,
      is_featured || false,
      is_published !== false,
      publish_date || new Date()
    ]);

    // Update category post count
    if (category_id) {
      await pool.query('UPDATE categories SET post_count = post_count + 1 WHERE id = ?', [category_id]);
    }

    res.status(201).json({ id: result.insertId, message: 'Post created successfully' });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// PUT /api/posts/:id - Update post (admin only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const {
      title, slug, excerpt, content, featured_image,
      category_id, author_id, tags, keywords, youtube_id,
      is_featured, is_published
    } = req.body;

    await pool.query(`
      UPDATE posts SET
        title = ?, slug = ?, excerpt = ?, content = ?, featured_image = ?,
        category_id = ?, author_id = ?, tags = ?, keywords = ?, youtube_id = ?,
        is_featured = ?, is_published = ?, updated_at = NOW()
      WHERE id = ?
    `, [
      title, slug, excerpt, content, featured_image,
      category_id, author_id, JSON.stringify(tags || []), JSON.stringify(keywords || []), youtube_id,
      is_featured, is_published, req.params.id
    ]);

    res.json({ message: 'Post updated successfully' });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Failed to update post' });
  }
});

// DELETE /api/posts/:id - Delete post (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    // Get category before delete for count update
    const [post] = await pool.query('SELECT category_id FROM posts WHERE id = ?', [req.params.id]);
    
    await pool.query('DELETE FROM posts WHERE id = ?', [req.params.id]);
    
    // Update category post count
    if (post.length > 0 && post[0].category_id) {
      await pool.query('UPDATE categories SET post_count = post_count - 1 WHERE id = ? AND post_count > 0', [post[0].category_id]);
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
});

// GET /api/posts/stats/overview - Get stats (admin only)
router.get('/stats/overview', verifyToken, async (req, res) => {
  try {
    const [[{ totalPosts }]] = await pool.query('SELECT COUNT(*) as totalPosts FROM posts');
    const [[{ totalViews }]] = await pool.query('SELECT SUM(views) as totalViews FROM posts');
    const [[{ totalCategories }]] = await pool.query('SELECT COUNT(*) as totalCategories FROM categories');
    const [[{ totalVideos }]] = await pool.query('SELECT COUNT(*) as totalVideos FROM youtube_videos');

    res.json({
      totalPosts,
      totalViews: totalViews || 0,
      totalCategories,
      totalVideos
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

module.exports = router;
