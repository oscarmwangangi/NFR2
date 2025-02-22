import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';
import db from '../../config/db.js';  // Use ES6 import
import crypto from 'crypto';
import cookieParser from "cookie-parser";

const router = express.Router();
export const ensureAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next(); // User is authenticated, proceed to the next middleware/route handler
    }
    res.status(401).json({ message: "Unauthorized" }); // User is not authenticated
  };
 router.get("/user-info", ensureAuth, async (req, res) => {
  try {
    // Assuming req.session.userId contains the authenticated user's ID
    const [rows] = await db.query(
      "SELECT first_name, second_name, email FROM users WHERE id = ?",
      [req.session.userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching user info:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/delivery-slot", ensureAuth, async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await db.query(
      "SELECT delivery_date AS date, time_slot AS slot FROM delivery_slots WHERE user_id = ?",
      [userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "No delivery slot found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching delivery slot:", error);
    res.status(500).json({ error: "Server error" });
  }
});


router.post("/delivery-slot", ensureAuth, async (req, res) => {
  const userId = req.user.id;
  const { date, slot } = req.body;
  
  // Convert the date into a format MySQL accepts
  const formattedDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ');
  
  try {
    const query = `
      INSERT INTO delivery_slots (user_id, delivery_date, time_slot, created_at, updated_at)
      VALUES (?, ?, ?, NOW(), NOW())
      ON DUPLICATE KEY UPDATE
        delivery_date = VALUES(delivery_date),
        time_slot = VALUES(time_slot),
        updated_at = NOW()
    `;
    await db.query(query, [userId, formattedDate, slot]);
    res.json({ message: "Delivery slot updated successfully" });
  } catch (error) {
    console.error("Error updating delivery slot:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/delivery-address", ensureAuth, async (req, res) => {
  const userId = req.user.id;
  try {
    const [rows] = await db.query(
      `SELECT 
        street, 
        city, 
        state, 
        postal_code AS postal_code, 
        google_place_id AS google_place_id, 
        phone_number AS phone_number, 
        building_name AS building_name, 
        apartment_number AS apartment_number, 
        address_label AS address_label 
       FROM delivery_addresses 
       WHERE user_id = ?`,
      [userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: "No delivery address found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching delivery address:", error);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/delivery-address", ensureAuth, async (req, res) => {
  const userId = req.user.id;
  const { street, city, state, postal_code, google_place_id, phone_number, building_name, apartment_number, address_label } = req.body;

  try {
    const query = `
      INSERT INTO delivery_addresses (
        user_id, 
        street, 
        city, 
        state, 
        postal_code, 
        google_place_id, 
        phone_number, 
        building_name, 
        apartment_number, 
        address_label, 
        created_at, 
        updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
      ON DUPLICATE KEY UPDATE
        street = VALUES(street),
        city = VALUES(city),
        state = VALUES(state),
        postal_code = VALUES(postal_code),
        google_place_id = VALUES(google_place_id),
        phone_number = VALUES(phone_number),
        building_name = VALUES(building_name),
        apartment_number = VALUES(apartment_number),
        address_label = VALUES(address_label),
        updated_at = NOW()
    `;
    await db.query(query, [
      userId,
      street,
      city,
      state,
      postal_code,
      google_place_id,
      phone_number,
      building_name,
      apartment_number,
      address_label,
    ]);
    res.json({ message: "Delivery address updated successfully" });
  } catch (error) {
    console.error("Error updating delivery address:", error);
    res.status(500).json({ error: "Server error" });
  }
});

  
// ensureAuth.js
// const ensureAuth = (req, res, next) => {
//   if (req.session && req.session.userId) {
//     return next();
//   } else {
//     res.status(401).json({ error: "Unauthorized" });
//   }
// };

export default router;