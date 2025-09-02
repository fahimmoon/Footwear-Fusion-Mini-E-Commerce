class ProductsController {
    constructor(productModel) {
        this.productModel = productModel;
    }

    async getAllProducts(req, res) {
        try {
            const products = await this.productModel.getAll();
            res.json(products);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving products' });
        }
    }

    async addProduct(req, res) {
        const newProduct = req.body;
        try {
            const createdProduct = await this.productModel.add(newProduct);
            res.status(201).json(createdProduct);
        } catch (error) {
            res.status(500).json({ message: 'Error adding product' });
        }
    }

    async updateProduct(req, res) {
        const productId = req.params.id;
        const updatedProduct = req.body;
        try {
            const result = await this.productModel.update(productId, updatedProduct);
            if (result) {
                res.json({ message: 'Product updated successfully' });
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error updating product' });
        }
    }

    async deleteProduct(req, res) {
        const productId = req.params.id;
        try {
            const result = await this.productModel.delete(productId);
            if (result) {
                res.json({ message: 'Product deleted successfully' });
            } else {
                res.status(404).json({ message: 'Product not found' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Error deleting product' });
        }
    }
}

export default ProductsController;