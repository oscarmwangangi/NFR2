// src/controllers/productController.js
import db from '../../config/db.js';  // Use ES6 import
import multer from 'multer';
import  {upload} from '../multer.js';  // Adjust the path as needed
import path from 'path';
import dotenv from 'dotenv'; // Import dotenv
dotenv.config();  // Load environment variables from .env file

// Add a new product
const addProduct = async (req, res) => {
  console.log(req.body);  // Debug log
  const { name, description, price, discount_price, in_stock, category, brand, size, gender, subcategory } = req.body;
  const image_path = req.file ? `uploads/${path.basename(req.file.path)}` : null;

  try {
    // Ensure size is stored as JSON
    let parsedSize = size; // Use let instead of const
    if (typeof size === "string") {
      parsedSize = JSON.parse(size); // Convert JSON string back to an array
    }

    const result = await db.execute(
      'INSERT INTO products (name, description, price, discount_price, in_stock, image_path, category, brand, size, gender, subcategory) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [name, description, price, discount_price, in_stock, image_path, category, brand, JSON.stringify(parsedSize), gender, subcategory]
    );
    res.status(201).json({ message: 'Product added successfully', productId: result[0].insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding product' });
  }
};
const getUserProducts = async (req, res) => {
  try {
    const category = req.query.category;
    let query = "SELECT * FROM products";
    let queryParams = [];

    if (category) {
      query += " WHERE category = ?";
      queryParams.push(category);
    }

    // Use async/await for executing queries
    const [results] = await db.execute(query, queryParams);

    res.status(200).json(results);
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ message: "Database error" });
  }
};
// Get all products
const getAllProducts = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM products');
    rows.forEach(product => {
      if (product.image_path) {
        product.image_path = `${process.env.BACKEND_URL}/${product.image_path}`;
      }
    });
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// Update product
const updateProduct = async (req, res) => {
  const productId = req.params.id;
  const { name, description, price, discount_price, in_stock, category, brand, size, gender, categories } = req.body;

  // Handle image file upload with multer
  const image_path = req.file ? `uploads/${path.basename(req.file.path)}` : null;
  
  // Ensure all values are defined or set to null if undefined
  const values = {
      name: name || null,
      description: description || null,
      price: price || null,
      discount_price: discount_price || null,
      in_stock: in_stock !== undefined ? in_stock : null,
      image_path: image_path,
      category: category || null,
      brand: brand || null,
      size: size || null,
      gender: gender || null,
      // product_category_id: product_category_id || null,
      categories: categories || null,
  };

  try {
      const result = await db.execute(
          'UPDATE products SET name = ?, description = ?, price = ?, discount_price = ?, in_stock = ?, image_path = ?, category = ?, brand = ?, size = ?, gender = ?, categories = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
          [
              values.name,
              values.description,
              values.price,
              values.discount_price,
              values.in_stock,
              values.image_path,
              values.category,
              values.brand,
              values.size,
              values.gender,
              // values.product_category_id,
              values.categories,
              productId,
          ]
      );
      res.status(200).json({ message: 'Product updated successfully' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating product' });
  }
};


// Delete product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute('DELETE FROM products WHERE id = ?', [id]);
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting product' });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM categories');
    console.log('Database rows:', rows); // Debugging

    const categoriesMap = new Map();
    rows.forEach(category => {
      if (!category) return; // Skip invalid entries
      category.subcategories = []; // Initialize subcategories
      categoriesMap.set(category.id, category);
    });

    const categoriesTree = [];
    rows.forEach(category => {
      if (!category) return; // Skip invalid entries

      if (category.parent_id) {
        const parent = categoriesMap.get(category.parent_id);
        if (parent && Array.isArray(parent.subcategories)) {
          parent.subcategories.push(category);
        }
      } else {
        categoriesTree.push(category);
      }
    });

    res.status(200).json(categoriesTree);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

// Add a new category
const addCategory = async (req, res) => {
  const { name, parent_id } = req.body;
  if (!name) return res.status(400).json({ message: 'Category name is required' });

  try {
    if (parent_id) {
      const [parent] = await db.execute('SELECT id FROM categories WHERE id = ?', [parent_id]);
      if (!parent.length) return res.status(400).json({ message: 'Invalid parent category' });
    }

    const [result] = await db.execute(
      'INSERT INTO categories (name, parent_id) VALUES (?, ?)',
      [name, parent_id || null]
    );
    
    res.status(201).json({ message: 'Category added successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding category' });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, parent_id } = req.body;

  try {
    // Prevent circular reference
    if (parent_id == id) return res.status(400).json({ message: 'Category cannot be its own parent' });

    if (parent_id) {
      const [parent] = await db.execute('SELECT id FROM categories WHERE id = ?', [parent_id]);
      if (!parent.length) return res.status(400).json({ message: 'Invalid parent category' });
    }

    await db.execute(
      'UPDATE categories SET name = COALESCE(?, name), parent_id = ? WHERE id = ?',
      [name, parent_id || null, id]
    );

    res.status(200).json({ message: 'Category updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating category' });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute("DELETE FROM categories WHERE id = ?", [id]);
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting category" });
  }
};

// Brand Controllers
// Brand Controllers
const getBrands = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM brands');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching brands' });
  }
};

const addBrand = async (req, res) => {
  const { name, category_id } = req.body;
  if (!name || !category_id) return res.status(400).json({ message: 'Brand name and category ID are required' });

  try {
    const [result] = await db.execute(
      'INSERT INTO brands (name, category_id) VALUES (?, ?)',
      [name, category_id]
    );
    res.status(201).json({ message: 'Brand added successfully', id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding brand' });
  }
};

const updateBrand = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    await db.execute(
      'UPDATE brands SET name = ? WHERE id = ?',
      [name, id]
    );
    res.status(200).json({ message: 'Brand updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating brand' });
  }
};

const deleteBrand = async (req, res) => {
  const { id } = req.params;

  try {
    await db.execute("DELETE FROM brands WHERE id = ?", [id]);
    res.status(200).json({ message: "Brand deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting brand" });
  }
};

// In your controller
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await db.execute("SELECT * FROM products WHERE id = ?", [id]);

    if (results.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(results[0]);  // Send the product data
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ message: "Database error" });
  }
};

// In your route


export default { updateCategory, deleteCategory ,getAllCategories, addCategory,upload, addProduct, getAllProducts, updateProduct, deleteProduct,getUserProducts,getProductById,deleteBrand,updateBrand,addBrand,getBrands };  // Default export

