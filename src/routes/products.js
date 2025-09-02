const express = require('express');
const router = express.Router();
const db = require('../db');

// Create a new product
router.post('/', async (req, res) => {
    const { name, price, description, image, category } = req.body;
    try {
        const [result] = await db.query('INSERT INTO products (name, price, description, image, category) VALUES (?, ?, ?, ?, ?)', [name, price, description, image, category]);
        res.status(201).json({ id: result.insertId, name });
    } catch (err) {
        console.error('POST /api/products error', err);
        res.status(500).json({ error: 'failed to create product' });
    }
});

// Fetch all products
router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT id, name, price, description, image, category, sales, tags, is_featured, is_bestseller, created_at FROM products ORDER BY created_at DESC');
        res.json({ products: rows });
    } catch (err) {
        console.error('GET /api/products error', err);
        res.status(500).json({ error: 'failed to load products' });
    }
});

module.exports = router;