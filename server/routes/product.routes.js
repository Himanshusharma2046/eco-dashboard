const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Get all products (public)
router.get('/', productController.getAllProducts);

// Export products to CSV (should come before /:id route)
router.get('/export', authMiddleware, productController.exportProducts);

// Get a single product by ID (public)
router.get('/:id', productController.getProductById);

// Protected routes (require authentication)
// Create a new product
router.post('/', authMiddleware, productController.createProduct);

// Update a product
router.put('/:id', authMiddleware, productController.updateProduct);

// Delete a product
router.delete('/:id', authMiddleware, productController.deleteProduct);

module.exports = router;
