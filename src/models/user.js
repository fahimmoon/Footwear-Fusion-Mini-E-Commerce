const dbDefault = require('../db');

class User {
    constructor(id, username, password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }

    static async createUser(db, username, password) {
        db = db || dbDefault;
        const [result] = await db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
        return new User(result.insertId, username, password);
    }

    static async getUserById(db, id) {
        db = db || dbDefault;
        const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
        return rows.length ? new User(rows[0].id, rows[0].username, rows[0].password) : null;
    }

    static async getUserByUsername(db, username) {
        db = db || dbDefault;
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        return rows.length ? new User(rows[0].id, rows[0].username, rows[0].password) : null;
    }

    static async updateUser(db, id, username, password) {
        db = db || dbDefault;
        await db.query('UPDATE users SET username = ?, password = ? WHERE id = ?', [username, password, id]);
        return new User(id, username, password);
    }

    static async deleteUser(db, id) {
        db = db || dbDefault;
        await db.query('DELETE FROM users WHERE id = ?', [id]);
    }

    static async fetchAllUsers(db) {
        db = db || dbDefault;
        const [rows] = await db.query('SELECT id, username FROM users');
        return rows;
    }
}

module.exports = User;