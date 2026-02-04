const express = require('express');
const { pool } = require('../config/database');
const { verifyToken } = require('../middleware/auth');
const router = express.Router();

// GET /api/categories - Get all categories (public)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
    res.json(rows);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET /api/categories/:slug - Get single category
router.get('/:slug', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categories WHERE slug = ?', [req.params.slug]);
    
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// POST /api/categories - Create category (admin only)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, slug, description, icon, color } = req.body;

    const [result] = await pool.query(`
      INSERT INTO categories (name, slug, description, icon, color)
      VALUES (?, ?, ?, ?, ?)
    `, [
      name,
      slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description || '',
      icon || 'Newspaper',
      color || '#DC2626'
    ]);

    res.status(201).json({ id: result.insertId, message: 'Category created successfully' });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// PUT /api/categories/:id - Update category (admin only)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { name, slug, description, icon, color } = req.body;

    await pool.query(`
      UPDATE categories SET name = ?, slug = ?, description = ?, icon = ?, color = ?
      WHERE id = ?
    `, [name, slug, description, icon, color, req.params.id]);

    res.json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// DELETE /api/categories/:id - Delete category (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

module.exports = router;
