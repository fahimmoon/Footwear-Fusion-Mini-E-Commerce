const express = require('express');
const router = express.Router();

// Use the singular controller that exports the CRUD handlers
const controller = require('../controllers/userController');

// Create a new user
router.post('/', controller.create);

// Fetch all users
router.get('/', controller.getAll);

// GET /users/:id
router.get('/:id', controller.getById);

// PUT /users/:id
router.put('/:id', controller.update);

// DELETE /users/:id
router.delete('/:id', controller.remove);

module.exports = router;
