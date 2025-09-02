const Product = require('../models/product');

exports.list = async (req, res) => {
    try {
        const products = await Product.getAllProducts();
        res.json({ products });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'internal server error' });
    }
};

exports.get = async (req, res) => {
    try {
        const product = await Product.getProductById(null, req.params.id);
        if (!product) return res.status(404).json({ error: 'not found' });
        res.json({ product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'internal server error' });
    }
};

exports.create = async (req, res) => {
    try {
        const { name, price, description } = req.body;
        if (!name || price === undefined) return res.status(400).json({ error: 'name and price required' });
        const product = await Product.createProduct(null, name, price, description || null);
        res.status(201).json({ product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'internal server error' });
    }
};

exports.update = async (req, res) => {
    try {
        const { name, price, description } = req.body;
        const product = await Product.updateProduct(null, req.params.id, name, price, description);
        res.json({ product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'internal server error' });
    }
};

exports.remove = async (req, res) => {
    try {
        await Product.deleteProduct(null, req.params.id);
        res.status(204).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'internal server error' });
    }
};
