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
  
  




export default router;