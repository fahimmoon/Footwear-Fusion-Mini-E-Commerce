const express = require('express');
const router = express.Router();
const CartController = require('../controllers/cartController');
const cartController = new CartController();

// Route to add an item to the cart
router.post('/add', cartController.addToCart);

// Route to view the cart
router.get('/', cartController.viewCart);

// Route to simulate checkout
router.post('/checkout', cartController.checkout);

module.exports = router;