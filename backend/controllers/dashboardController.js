import express from 'express';
import db from '../../config/db.js';
import dotenv from 'dotenv';


dotenv.config(); // load environment variables from a .env file

const router = express.Router();

// Sales Over Time
router.get('/dashboard/sales-data', async (req, res) => {
  const [rows] = await db.query(`
    SELECT DATE(delivery_date) AS date, SUM(total) AS sum
    FROM orders WHERE status='pending'
    GROUP BY DATE(delivery_date)
    ORDER BY DATE(delivery_date) DESC LIMIT 30
  `);
  res.json(rows.reverse()); // oldest → newest
});

// Orders by Category
router.get('/dashboard/order-categories', async (req, res) => {
  const [rows] = await db.query(`
    SELECT 
      c.name AS category_name,
      COUNT(*) AS count
    FROM orders o
    JOIN JSON_TABLE(
      o.cart_items,
      '$[*]' COLUMNS (
        product_id INT PATH '$.product_id'
      )
    ) AS ci
    JOIN products p ON p.id = ci.product_id
    JOIN categories c ON c.id = p.category
    WHERE o.status = 'pending'
    GROUP BY c.name;
  `);

  const counts = {};

  rows.forEach(row => {
    counts[row.category_name] = row.count;
  });

  res.json(counts); // e.g., { "Electronics": 10, "Clothing": 5 }
});




// Customer Growth
router.get('/dashboard/customer-growth', async (req, res) => {
  const [rows] = await db.query(`
    SELECT DATE(last_login) AS date, COUNT(*) AS count
    FROM users WHERE last_login IS NOT NULL
      AND last_login >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    GROUP BY DATE(last_login)
    ORDER BY DATE(last_login) DESC LIMIT 30
  `);
  res.json(rows.reverse());
});

// Recent Orders
router.get('/dashboard/recent-orders', async (req, res) => {
  const [rows] = await db.query(`
    SELECT order_id,first_name,second_name, total, delivery_date, status
    FROM orders ORDER BY delivery_date DESC LIMIT 5
  `);
  res.json(rows);
});
// Order Status Distribution
router.get('/dashboard/order-statuses', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        status,
        COUNT(*) AS count
      FROM orders
      GROUP BY status
      ORDER BY count DESC
    `);
    
    res.json(rows);
  } catch (error) {
    console.error('Error fetching order statuses:', error);
    res.status(500).json({ 
      message: 'Failed to fetch order statuses',
      error: error.message
    });
  }
});
export default router;