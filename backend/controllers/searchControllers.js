// src/controllers/productController.js
import db from '../../config/db.js';  // Use ES6 import
import multer from 'multer';
import  {upload} from '../multer.js';  // Adjust the path as needed
import path from 'path';
import dotenv from 'dotenv'; // Import dotenv
dotenv.config();  // Load environment variables from .env file


const userSearch = async (req, res) => {
    const { q } = req.query;
    try {
        const [results] = await db.execute(
            "SELECT * FROM products WHERE name LIKE ? LIMIT 5",
            [`%${q}%`]
          );
          
      res.status(200).json(results);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching search results" });
    }
  };

export default { userSearch };  // Default export

