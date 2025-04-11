const db = require('../config/db.config');
const path = require('path');
const fs = require('fs');

// Get all products with pagination and search
exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    
    let query = 'SELECT * FROM products';
    let countQuery = 'SELECT COUNT(*) as total FROM products';
    
    const queryParams = [];
    
    if (search) {
      query += ' WHERE name LIKE ? OR description LIKE ?';
      countQuery += ' WHERE name LIKE ? OR description LIKE ?';
      queryParams.push(`%${search}%`, `%${search}%`);
    }
    
    query += ' ORDER BY id DESC LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);
    
    const [products] = await db.query(query, queryParams);
    const [countResult] = await db.query(countQuery, search ? [`%${search}%`, `%${search}%`] : []);
    
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      products,
      pagination: {
        page,
        limit,
        total,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single product by ID
exports.getProductById = async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(products[0]);
  } catch (error) {
    console.error('Error getting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock_quantity, image_url } = req.body;
    
    const [result] = await db.query(
      'INSERT INTO products (name, description, price, stock_quantity, image_url) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, stock_quantity, image_url]
    );
    
    res.status(201).json({
      id: result.insertId,
      name,
      description,
      price,
      stock_quantity,
      image_url
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock_quantity, image_url } = req.body;
    const productId = req.params.id;
    
    // Check if product exists
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
    
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await db.query(
      'UPDATE products SET name = ?, description = ?, price = ?, stock_quantity = ?, image_url = ? WHERE id = ?',
      [name, description, price, stock_quantity, image_url, productId]
    );
    
    res.json({
      id: productId,
      name,
      description,
      price,
      stock_quantity,
      image_url
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    
    // Check if product exists
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [productId]);
    
    if (products.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await db.query('DELETE FROM products WHERE id = ?', [productId]);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Export products to CSV
exports.exportProducts = async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products');
    
    if (products.length === 0) {
      return res.status(404).json({ message: 'No products to export' });
    }
    
    // Create CSV content
    const headers = ['ID', 'Name', 'Description', 'Price', 'Stock Quantity', 'Image URL'];
    const csvData = [
      headers.join(','),
      ...products.map(product => [
        product.id,
        `"${product.name.replace(/"/g, '""')}"`,
        `"${(product.description || '').replace(/"/g, '""')}"`,
        product.price,
        product.stock_quantity,
        `"${product.image_url || ''}"`
      ].join(','))
    ].join('\n');
    
    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=products.csv');
    
    // Send CSV data
    res.send(csvData);
  } catch (error) {
    console.error('Error exporting products:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
