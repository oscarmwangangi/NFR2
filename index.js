import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import passport from 'passport';
import productController from './backend/controllers/productController.js';
import deliveryRoutes from './backend/controllers/deliveryRoutes.js';
import orderController from './backend/controllers/orderController.js';
import mpesaController from './backend/controllers/mpesaController.js';
import http from 'http';
import { Server } from 'socket.io';
import chatController from './backend/controllers/chatController.js';
import multer from 'multer';
import { upload } from './backend/multer.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import LoginRoutes from './backend/LoginRoutes/LoginRoutes.js';
import cartController from './backend/controllers/cartController.js';
import recentViewedController from './backend/controllers/recentViewedController.js';
import adminChatController from './backend/controllers/adminChatController.js';
import searchControllers from './backend/controllers/searchControllers.js';
import ReportAbuseController from './backend/controllers/ReportAbuseController.js';
// Initialize dotenv to load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app); 
const io = new Server(server); 

const PORT = 5000;

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://e78f-62-8-69-150.ngrok-free.app'],
    credentials: true, // Allow cookies/session
  })
);

app.use(
  session({
    secret: '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', // Replace with a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      sameSite: 'none', // Helps with CSRF protection
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware to attach user to request
app.use((req, res, next) => {
  if (!req.user && req.session.user) {
    req.user = req.session.user;
  }
  next();
});

// Routes
app.get('/check-session', (req, res) => {
  console.log('Session contents:', req.session);
  console.log('Passport session data:', req.session.passport);
  console.log('Authenticated user:', req.user);
  res.json({ user: req.isAuthenticated() ? req.user : null });
});

app.use('/api', LoginRoutes);
app.use('/api', deliveryRoutes);
app.use('/api', cartController);
app.use('/api', orderController);
app.use('/api', recentViewedController);
app.use('/api', mpesaController);

app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// search route


app.get("/api/user/products/suggestions", searchControllers.userSearch);
// 
// Product routes
app.post('/api/products', upload.single('image'), productController.addProduct); // Add product
app.get('/api/products', productController.getAllProducts); // Get all products
app.get('/api/user/products/:id', productController.getProductById);
app.get('/api/user/products', productController.getUserProducts); // Correct route
app.delete('/api/products/:id', productController.deleteProduct); // Delete product
app.put('/api/products/:id', upload.single('image'), productController.updateProduct); // Update product

// Category routes
app.get('/api/categories/:id', productController.getCategoryById);
app.get('/api/categories', productController.getAllCategories);
app.post('/api/categories', productController.addCategory);
app.put('/api/categories/:id', productController.updateCategory);
app.delete('/api/categories/:id', productController.deleteCategory);

// Brand routes
app.get('/api/brands', productController.getBrands);
app.post('/api/brands', productController.addBrand);
app.put('/api/brands/:id', productController.updateBrand);
app.delete('/api/brands/:id', productController.deleteBrand);

// Chat routes
app.get('/api/messages', chatController.getMessages); 
chatController.setSocketIO(io);

app.get('/api/admin/chats', adminChatController.getAdminChats);
app.get('/api/admin/messages', adminChatController.getAdminMessages);
adminChatController.setSocketIO(io);

// reportabuse router
// Routes
app.post('/api/submit_report', upload.single('attachment'), ReportAbuseController.submitReport);
app.get('/api/reports', ReportAbuseController.getAllReports);
app.patch('/api/reports/:reportId', ReportAbuseController.updateReportStatus);
app.delete('/api/reports/:reportId', ReportAbuseController.deleteReport);


app.use(express.static(path.join(__dirname, './frontend/build')));
// Handle React routing, return all requests to React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, './frontend/build', 'index.html'));
});
// Start the server
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});