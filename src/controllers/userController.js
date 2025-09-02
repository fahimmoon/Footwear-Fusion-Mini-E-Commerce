const User = require('../models/user');

exports.create = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ error: 'username and password required' });
        const existing = await User.getUserByUsername(null, username);
        if (existing) return res.status(409).json({ error: 'username taken' });
        const user = await User.createUser(null, username, password);
        res.status(201).json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'internal server error' });
    }
};

exports.getAll = async (req, res) => {
    try {
        const rows = await User.fetchAllUsers(null);
        res.json({ users: rows });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'internal server error' });
    }
};

exports.getById = async (req, res) => {
    try {
        const user = await User.getUserById(null, req.params.id);
        if (!user) return res.status(404).json({ error: 'not found' });
        res.json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'internal server error' });
    }
};

exports.update = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.updateUser(null, req.params.id, username, password);
        res.json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'internal server error' });
    }
};

exports.remove = async (req, res) => {
    try {
        await User.deleteUser(null, req.params.id);
        res.status(204).end();
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'internal server error' });
    }
};
