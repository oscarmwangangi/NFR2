import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';
import db from '../../config/db.js';  // Use ES6 import
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import crypto from 'crypto'
import { Strategy as LocalStrategy } from 'passport-local';
const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// routes/cart.js or similar
// routes/cart.js

export const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, proceed to the next middleware/route handler
  }
  res.status(401).json({ message: "Unauthorized" }); // User is not authenticated
};

router.post('/cart/sync', async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    // Expecting { cart: [ { id: product_id, quantity: number }, ... ] }
    const { cart } = req.body;
    if (!cart || !Array.isArray(cart)) {
      return res.status(400).json({ message: "Invalid cart data" });
    }
    
    try {
      for (const item of cart) {
        // Use ON DUPLICATE KEY UPDATE to add quantities if the product already exists
        await db.query(
          `INSERT INTO cart_items (user_id, product_id, quantity)
           VALUES (?, ?, ?)
           ON DUPLICATE KEY UPDATE quantity = quantity + ?`,
          [req.user.id, item.id, item.quantity, item.quantity]
        );
      }
      return res.json({ message: 'Cart synchronized successfully' });
    } catch (error) {
      console.error('Cart sync error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
  
  router.get('/cart', async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
      const [rows] = await db.query(
        `SELECT ci.*, p.name, p.price, p.image_path 
         FROM cart_items ci
         JOIN products p ON ci.product_id = p.id
         WHERE ci.user_id = ?`,
         [req.user.id]
      );
      return res.json({ cart: rows });
    } catch (error) {
      console.error('Error fetching cart:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  });
  

  router.put('/cart/update', async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { product_id, quantity } = req.body;
    try {
      if (quantity <= 0) {
        // Remove the item if quantity is 0 or less
        await db.query(
          "DELETE FROM cart_items WHERE user_id = ? AND product_id = ?",
          [req.user.id, product_id]
        );
      } else {
        await db.query(
          "UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?",
          [quantity, req.user.id, product_id]
        );
      }
      return res.json({ message: "Cart updated" });
    } catch (error) {
      console.error("Error updating cart:", error);
      return res.status(500).json({ message: "Server error" });
    }
  });
  
  
  router.delete("/cart/:itemId", async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    // Use req.user.id instead of req.session.userId
    const userId = req.user.id;
    const { itemId } = req.params;
  
    console.log("Deleting item with ID:", itemId, "for user:", userId); // Debug log
  
    try {
      const [result] = await db.query(
        "DELETE FROM cart_items WHERE id = ? AND user_id = ?",
        [itemId, userId]
      );
      console.log("Affected rows:", result.affectedRows); // Debug log
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Item not found or not authorized" });
      }
      res.json({ message: "Item deleted successfully" });
    } catch (error) {
      console.error("Error deleting item:", error);
      res.status(500).json({ error: "Failed to delete item" });
    }
  });
  
// GET /admin/cart-summary
router.get('/admin/cart-summary', async (req, res) => {
  try {
    const [cartItems] = await db.query(`
      SELECT 
        SUM(quantity) AS totalItems,
        COUNT(DISTINCT user_id) AS activeCarts
      FROM cart_items
    `);

    const [topProducts] = await db.query(`
      SELECT 
        p.name, SUM(ci.quantity) as totalQuantity
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      GROUP BY ci.product_id
      ORDER BY totalQuantity DESC
      LIMIT 5
    `);

    res.json({
      totalItems: cartItems[0].totalItems || 0,
      activeCarts: cartItems[0].activeCarts || 0,
      topProducts,
    });
  } catch (err) {
    console.error("Cart summary fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});



export default router;