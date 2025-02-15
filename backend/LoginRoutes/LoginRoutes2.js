// import express from 'express';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';
// import nodemailer from 'nodemailer';
// import { OAuth2Client } from 'google-auth-library';
// import db from '../../config/db.js';  // Use ES6 import
// import crypto from 'crypto';
// import cookieParser from "cookie-parser";

// const router = express.Router();
// const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// router.use(cookieParser());

// function generateOTP() {
//   return crypto.randomInt(100000, 999999).toString();
// }

// // JWT Secret Key
// const JWT_SECRET = "0c7c791abc978cba5df532979e02303710036455c326bd476a6fc3fe0e4438be";

// // Email transporter for sending OTP
// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//       user: 'mwangangioscar2016@gmail.com',
//       pass: 'sffw rcvv fcyr iqtz'
//   }
// });

// async function sendOTPEmail(email, otp) {
//   const mailOptions = {
//       from: 'NFR Store',
//       to: email,
//       subject: 'Email Verification OTP',
//       text: `Your OTP for login is ${otp}`
//   };

//   try {
//       await transporter.sendMail(mailOptions);
//   } catch (error) {
//       console.error("Error sending OTP email:", error);
//   }
// }

// // Login Route (No Passport)
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Check if user exists
//     const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    
//     if (user.length === 0) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     // Verify Password
//     const isMatch = await bcrypt.compare(password, user[0].password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid email or password" });
//     }

//     // Generate OTP and store it
//     const otp = generateOTP();
//     await db.query("INSERT INTO otp_verification (email, otp) VALUES (?, ?)", [email, otp]);

//     // Send OTP
//     await sendOTPEmail(email, otp);

//     res.status(200).json({ message: "Login successful. Please check your email for the OTP." });

//   } catch (error) {
//     console.error("Login error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Verify OTP and Create JWT Token
// router.post('/verify-login-otp', async (req, res) => {
//   const { email, otp } = req.body;

//   try {
//     // Check OTP
//     const [verification] = await db.query(
//       "SELECT * FROM otp_verification WHERE email = ? AND otp = ?",
//       [email, otp]
//     );

//     if (verification.length === 0) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }

//     // Fetch user details
//     const [userResult] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
//     if (userResult.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     const user = userResult[0];

//     // Generate JWT Token
//     const token = jwt.sign(
//       { id: user.id, email: user.email, first_name: user.first_name, second_name: user.second_name },
//       JWT_SECRET,
//       { expiresIn: "1h" }
//     );

//     // Delete OTP record
//     await db.query("DELETE FROM otp_verification WHERE email = ?", [email]);

//     res.status(200).json({
//       token,
//       user: { id: user.id, email: user.email, first_name: user.first_name, second_name: user.second_name },
//       message: "OTP verified successfully. You are now logged in.",
//     });

//   } catch (error) {
//     console.error("OTP verification error:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // Middleware to authenticate JWT Token
// const authenticateJWT = (req, res, next) => {
//   const token = req.headers.authorization?.split(" ")[1];

//   if (!token) {
//     return res.status(401).json({ message: "Unauthorized: No token provided" });
//   }

//   jwt.verify(token, JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(403).json({ message: "Unauthorized: Invalid token" });
//     }

//     req.user = decoded;
//     next();
//   });
// };

// // Get User Data (Authenticated)
// router.get('/user', authenticateJWT, async (req, res) => {
//   try {
//     const [user] = await db.query("SELECT * FROM users WHERE id = ?", [req.user.id]);
//     if (user.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json({ user: user[0] });
//   } catch (error) {
//     console.error("Error fetching user data:", error);
//     res.status(500).json({ message: "Server error" });
//   }
// });

// export default router;
