import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import productController from './backend/controllers/productController.js';
import deliveryRoutes from './backend/controllers/deliveryRoutes.js';
import orderController from './backend/controllers/orderController.js';
import mpesaController from './backend/controllers/mpesaController.js';

import multer from 'multer';
import {upload} from './backend/multer.js'
const app = express();
import path from 'path';
import { fileURLToPath } from 'url';
  // Import the LoginRoutes module

import cookieParser from 'cookie-parser';
const PORT = 5000;

// Correct import statement

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  cors({
    origin: "http://localhost:3000", // Your frontend URL
    credentials: true, // Allow cookies/session
  })
);

app.use(session({
  secret: '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',  // Replace with a strong secret
  resave: false,
  saveUninitialized: true,  
  cookie: {
    httpOnly: true,
    // secure: process.env.NODE_ENV === 'production', // Use only over HTTPS in production
    sameSite: 'lax', // Helps with CSRF protection
    maxAge: 1000 * 60 * 60 * 24, // 1 day
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

import LoginRoutes from './backend/LoginRoutes/LoginRoutes.js';
import cartController from './backend/controllers/cartController.js';
import recentViewedController from './backend/controllers/recentViewedController.js';
// import LoginRoutes2 from './backend/LoginRoutes/LoginRoutes2.js';
// Sample API endpoint
// Place this middleware after your session middleware and before your routes
app.use((req, res, next) => {
  if (!req.user && req.session.user) {
    req.user = req.session.user;
  }
  next();
});
app.get("/check-session", (req, res) => {
  console.log("Session contents:", req.session);
  console.log("Passport session data:", req.session.passport);
  console.log("Authenticated user:", req.user);
  res.json({ user: req.isAuthenticated() ? req.user : null });
});


app.use('/api', LoginRoutes);
app.use('/api', deliveryRoutes);
app.use('/api', cartController);
app.use('/api', orderController);
app.use('/api', recentViewedController);
app.use('/api', mpesaController);
// app.use('/api', LoginRoutes2);
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

app.get('/api/data', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.post('/api/products', upload.single('image'), productController.addProduct);  // Add product

app.get('/api/products', productController.getAllProducts); // Get all products
app.get("/api/user/products/:id", productController.getProductById);
app.get("/api/user/products", productController.getUserProducts); // Correct route
app.delete('/api/products/:id', productController.deleteProduct); // Delete product
app.put('/api/products/:id',upload.single('image'), productController.updateProduct);
 // Update product

app.get('/api/categories', productController.getAllCategories);
app.post('/api/categories', productController.addCategory);
app.put("/api/categories/:id",  productController.updateCategory);
app.delete("/api/categories/:id",  productController.deleteCategory);

app.get('/api/brands', productController.getBrands);
app.post('/api/brands', productController.addBrand);
app.put("/api/brands/:id",  productController.updateBrand);
app.delete("/api/brands/:id",  productController.deleteBrand);


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