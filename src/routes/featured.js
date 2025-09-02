const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM featured_products');
    return res.json({ products: rows });
  } catch (err) {
    console.error('GET /api/featured error', err);
    res.status(500).json({ error: 'failed to load featured products' });
  }
});

module.exports = router;
