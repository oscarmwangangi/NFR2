import express from 'express';
import db from '../../config/db.js';
const router = express.Router();

// ======================================
// SYNC: Sync recent viewed items from localStorage to DB
// ======================================
router.post('/recent-viewed/sync', async (req, res) => {
  // Debug: log session and user details
  console.log("Sync endpoint called");
  console.log("req.session:", req.session);
  console.log("req.user:", req.user);

  let userId;
  if (req.user && req.user.id) {
    userId = req.user.id;
  } else if (req.session && req.session.user && req.session.user.id) {
    userId = req.session.user.id;
  } else {
    console.error("User not authenticated for syncing recent viewed items");
    return res.status(401).json({ message: 'Unauthorized' });
  }

  // Expecting { recentViewed: [ { id: product_id, ... }, ... ] }
  const { recentViewed } = req.body;
  if (!recentViewed || !Array.isArray(recentViewed)) {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    // Loop through each recently viewed item and insert/update it.
    for (const item of recentViewed) {
      await db.query(
        `INSERT INTO recent_viewed (user_id, product_id)
         VALUES (?, ?)
         ON DUPLICATE KEY UPDATE viewed_at = CURRENT_TIMESTAMP`,
        [userId, item.id]
      );
    }
    return res.json({ message: 'Recent viewed items synced successfully' });
  } catch (error) {
    console.error('Recent viewed sync error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});



// ======================================
// SAVE: Save a single recently viewed product (for logged-in users)
// ======================================
router.post('/recent-viewed', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  const { productId } = req.body;
  const userId = req.user.id;
  if (!productId) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    // Check if the product already exists for this user
    const [existing] = await db.query(
      "SELECT * FROM recent_viewed WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );

    if (existing.length > 0) {
      // Update the timestamp if it already exists
      await db.query(
        "UPDATE recent_viewed SET viewed_at = NOW() WHERE user_id = ? AND product_id = ?",
        [userId, productId]
      );
    } else {
      // Insert a new record
      await db.query(
        "INSERT INTO recent_viewed (user_id, product_id, viewed_at) VALUES (?, ?, NOW())",
        [userId, productId]
      );
    }
    res.status(200).json({ message: "Product saved to recently viewed" });
  } catch (error) {
    console.error("Error saving recently viewed product:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ======================================
// FETCH: Get the logged-in user's recent viewed products
// ======================================
router.get('/recent-viewed', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const [rows] = await db.query(
      `SELECT rv.*, p.name, p.price, p.image_path, p.discount_price
       FROM recent_viewed rv
       JOIN products p ON rv.product_id = p.id
       WHERE rv.user_id = ?
       ORDER BY rv.viewed_at DESC
       LIMIT 10`,  // Adjust limit as needed
      [req.user.id]
    );
    return res.json({ recentViewed: rows });
  } catch (error) {
    console.error('Error fetching recent viewed:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// ======================================
// SESSION CHECK ENDPOINTS
// --------------------------------------
// For manual login: using the manually stored session (req.session.user)
// --------------------------------------
router.get('/check-session-manual', (req, res) => {
  if (req.session && req.session.user) {
    return res.json({ user: req.session.user });
  }
  return res.status(401).json({ message: "User not logged in manually" });
});

// --------------------------------------
// For Passport (e.g., Google Auth): uses req.user
// --------------------------------------
// router.get('/check-session', (req, res) => {
//   if (req.user) {
//     return res.json({ user: req.user });
//   }
//   return res.status(401).json({ message: "User not logged in" });
// });

export default router;
