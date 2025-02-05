// src/db.js
import mysql from 'mysql2';

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'oscar',
  database: 'NFR_Online_Store'
});

export default pool.promise();
