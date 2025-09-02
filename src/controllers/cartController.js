class CartController {
    constructor() {
        this.cart = [];
    }

    addToCart(req, res) {
        const productId = req.body.productId;
        const quantity = req.body.quantity || 1;

        const existingProductIndex = this.cart.findIndex(item => item.productId === productId);
        if (existingProductIndex > -1) {
            this.cart[existingProductIndex].quantity += quantity;
        } else {
            this.cart.push({ productId, quantity });
        }

        req.session.cart = this.cart;
        res.status(200).json({ message: 'Product added to cart', cart: this.cart });
    }

    viewCart(req, res) {
        const cart = req.session.cart || [];
        res.status(200).json({ cart });
    }

    checkout(req, res) {
        const cart = req.session.cart || [];
        if (cart.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        const totalPrice = cart.reduce((total, item) => {
            // Assuming we have a method to get product price by ID
            const product = this.getProductById(item.productId);
            return total + (product.price * item.quantity);
        }, 0);

        req.session.cart = []; // Clear the cart after checkout
        res.status(200).json({ message: 'Checkout successful', totalPrice });
    }

    getProductById(productId) {
        // This method should interact with the database to get product details
        // Placeholder implementation
        return { price: 10 }; // Example price
    }
}

module.exports = CartController;