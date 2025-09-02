const dbDefault = require('../db');

class Product {
    constructor(id, name, price, description, created_at, updated_at) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.description = description;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    static async createProduct(db, name, price, description) {
        db = db || dbDefault;
        const [result] = await db.query('INSERT INTO products (name, price, description) VALUES (?, ?, ?)', [name, price, description]);
        return new Product(result.insertId, name, price, description, new Date(), new Date());
    }

    static async getProductById(db, id) {
        db = db || dbDefault;
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        return rows.length ? new Product(rows[0].id, rows[0].name, rows[0].price, rows[0].description, rows[0].created_at, rows[0].updated_at) : null;
    }

    static async getAllProducts(db) {
        db = db || dbDefault;
        const [rows] = await db.query('SELECT * FROM products ORDER BY created_at DESC');
        return rows.map(r => new Product(r.id, r.name, r.price, r.description, r.created_at, r.updated_at));
    }

    static async updateProduct(db, id, name, price, description) {
        db = db || dbDefault;
        await db.query('UPDATE products SET name = ?, price = ?, description = ? WHERE id = ?', [name, price, description, id]);
        return new Product(id, name, price, description, null, new Date());
    }

    static async deleteProduct(db, id) {
        db = db || dbDefault;
        await db.query('DELETE FROM products WHERE id = ?', [id]);
    }

    static async fetchAllProducts(db) {
        db = db || dbDefault;
        const [rows] = await db.query('SELECT * FROM products');
        return rows;
    }
}

module.exports = Product;