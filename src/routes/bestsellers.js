const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM bestseller_products');
    return res.json({ products: rows });
  } catch (err) {
    console.error('GET /api/bestsellers error', err);
    res.status(500).json({ error: 'failed to load bestseller products' });
  }
});

module.exports = router;
