import express from 'express';
import dotenv from 'dotenv';
import productController from './backend/controllers/productController.js';
import cors from 'cors';
import multer from 'multer';
import {upload} from './backend/multer.js'
const app = express();
import path from 'path';
import { fileURLToPath } from 'url';
import LoginRoutes from './backend/LoginRoutes/LoginRoutes.js';  // Import the LoginRoutes module
// import './passport.js'; 
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';
const PORT = 5000;

// Correct import statement
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(session({
  secret: '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',  // Replace with a strong secret
  resave: false,
  saveUninitialized: true,  // Add a comma here
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Sample API endpoint
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.post('/api/products', upload.single('image'), productController.addProduct);  // Add product

app.get('/api/products', productController.getAllProducts); // Get all products
app.get("/api/user/products/:id", productController.getProductById);
app.get("/api/user/products", productController.getUserProducts); // Correct route

app.put('/api/products/:id',upload.single('image'), productController.updateProduct);
 // Update product

app.get('/api/categories', productController.getAllCategories);
app.post('/api/categories', productController.addCategory);
 
app.delete('/api/products/:id', productController.deleteProduct); // Delete product

app.put("/api/categories/:id",  productController.updateCategory);
app.delete("/api/categories/:id",  productController.deleteCategory);

app.use('/api', LoginRoutes);
// Express serves the frontend React app in production (explained below)


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});




// REACT_APP_API_URL=http://localhost:5000/api

// BACKEND_URL=http://localhost:5000


// # JWT Secret (for signing JWT tokens)
// JWT_SECRET=3e71f3fe1ef0113553776f946ed818150317b9cd282141494f4d8690b7bd06a829b13dbfa4e251d828aed497ec4a59d4f1cac8d00c54f3e47d539794119a0acb

// # Google OAuth2 Client ID (for Google authentication)
// # GOOGLE_CLIENT_ID=your_google_client_id
// GOOGLE_CLIENT_ID="331450312488-lavpfaas8tgdpjk2ij7tnns8hl5j732h.apps.googleusercontent.com"
// GOOGLE_CLIENT_SECRET="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"
// # Email credentials for sending OTPs (via Nodemailer)
// EMAIL_USER=mwangangioscar2016@gmail.com
// EMAIL_PASS=8964"Mutura"