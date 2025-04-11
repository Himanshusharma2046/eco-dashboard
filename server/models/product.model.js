const db = require('../config/db.config');

class Product {
  static async findAll(limit = 10, offset = 0, search = '') {
    let query = 'SELECT * FROM products';
    const params = [];
    
    if (search) {
      query += ' WHERE name LIKE ? OR description LIKE ?';
      params.push(`%${search}%`, `%${search}%`);
    }
    
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const [rows] = await db.execute(query, params);
    
    // Get total count for pagination
    let countQuery = 'SELECT COUNT(*) as total FROM products';
    if (search) {
      countQuery += ' WHERE name LIKE ? OR description LIKE ?';
    }
    
    const [countResult] = await db.execute(
      countQuery, 
      search ? [`%${search}%`, `%${search}%`] : []
    );
    
    return {
      products: rows,
      total: countResult[0].total
    };
  }

  static async findById(id) {
    const [rows] = await db.execute('SELECT * FROM products WHERE id = ?', [id]);
    return rows[0];
  }

  static async create(productData) {
    const { name, description, price, image_url, stock_quantity } = productData;
    
    const [result] = await db.execute(
      'INSERT INTO products (name, description, price, image_url, stock_quantity) VALUES (?, ?, ?, ?, ?)',
      [name, description, price, image_url, stock_quantity]
    );
    
    return { id: result.insertId, ...productData };
  }

  static async update(id, productData) {
    const { name, description, price, image_url, stock_quantity } = productData;
    
    await db.execute(
      'UPDATE products SET name = ?, description = ?, price = ?, image_url = ?, stock_quantity = ? WHERE id = ?',
      [name, description, price, image_url, stock_quantity, id]
    );
    
    return { id, ...productData };
  }

  static async delete(id) {
    const [result] = await db.execute('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Product;
