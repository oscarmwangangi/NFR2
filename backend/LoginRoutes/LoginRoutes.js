import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { OAuth2Client } from 'google-auth-library';
import db from '../../config/db.js';  // Use ES6 import
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import crypto from 'crypto'
import { Strategy as LocalStrategy } from 'passport-local';
const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// MySQL database connection


function generateOTP() {
  return crypto.randomInt(100000, 999999).toString();
}

// Create a transporter for sending OTP email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'mwangangioscar2016@gmail.com',
      pass: 'sffw rcvv fcyr iqtz'
  }
});

// Send OTP email to the user
async function sendOTPEmail(email, otp) {
  const mailOptions = {
      from: 'NFR Store',
      to: email,
      subject: 'Email Verification OTP',
      text: `Your OTP for login is ${otp}`
  };

  try {
      await transporter.sendMail(mailOptions);
  } catch (error) {
      console.error("Error sending OTP email:", error);
  }
}


// Google Auth route (initiate login)
router.get('/auth/google', (req, res, next) => {
  console.log('Initiating Google OAuth...');
  next();
}, passport.authenticate('google', {
  scope: ['profile', 'email']
}));

router.get('/auth/google/callback', (req, res, next) => {
  console.log('Google OAuth callback...');
  next();
}, passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  console.log('Google OAuth successful, redirecting to /dashboard');
  res.redirect(`${process.env.FRONTEND_URL}`);
});

// Google OAuth Strategy configuration





passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URL}/api/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
  try {
    console.log('Google Profile:', profile);  // Log the entire profile object
    
    const { email, id, given_name, family_name } = profile._json;  // Use profile._json to access raw data
    
    // Check if email is present
    if (!email) {
      console.error('Email is missing from the Google profile');
      return done(new Error('Email is missing'), null);
    }

    // Check if the user already exists by email
    const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (user.length > 0) {
      // If user exists, return the user
      return done(null, user[0]);
    } else {
      // If user doesn't exist, create a new user record
      const [result] = await db.query(
        'INSERT INTO users (email, google_id, first_name, second_name, password, email_verified, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)', 
        [email, id, given_name, family_name, null, true, new Date()]
      );

      // Fetch the newly inserted user using the insertId
      const [newUser] = await db.query('SELECT * FROM users WHERE id = ?', [result.insertId]);

      if (newUser.length > 0) {
        return done(null, newUser[0]);
      } else {
        return done(new Error('Failed to fetch newly created user'), null);
      }
    }
  } catch (error) {
    console.error('Error in Google OAuth:', error);
    return done(error, null);
  }
}));


// Serialize user into the session
passport.serializeUser((user, done) => {
  // Ensure the user object has an 'id' property
  if (user && user.id) {
    done(null, user.id);
  } else {
    done(new Error('User object is missing an id'), null);
  }
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  console.log("Deserializing user with id:", id);  // Log the id passed to deserialize
  try {
    const [user] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    if (user.length > 0) {
      console.log("User found:", user[0]);  // Log the user object found from DB
      done(null, user[0]);  // Pass the user back into the session
    } else {
      console.log("User not found in database with id:", id);
      done(new Error('User not found'), null);
    }
  } catch (error) {
    console.error("Error during deserialization:", error);
    done(error, null);
  }
});


// Register route

router.post('/register', async (req, res) => {
    const { email, password, first_name, second_name } = req.body;
  
    if (!email || !password || !first_name || !second_name) {
      return res.status(400).send({ message: 'All fields (email, password, first name, second name) are required' });
    }
  
    try {
      // Check if email already exists
      const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  
      if (existingUser.length > 0) {
        return res.status(400).send({ message: 'Email is already registered' });
      }
  
      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Generate OTP
      const otp = Math.floor(100000 + Math.random() * 900000);  // 6-digit OTP
  
      // Store OTP temporarily in the otp_verification table
      await db.query('INSERT INTO otp_verification (email, otp) VALUES (?, ?)', [email, otp]);
  
      // Send OTP to user's email using nodemailer
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'mwangangioscar2016@gmail.com',
          pass: 'sffw rcvv fcyr iqtz'
        }
      });
  
      const mailOptions = {
        from: 'NFR Store',
        to: email,
        subject: 'Email Verification OTP',
        text: `Your OTP for registration is ${otp}`
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          return res.status(500).send({ message: 'Failed to send OTP email' });
        }
        res.status(200).send({ message: 'Registration successful. OTP sent to your email.' });
      });
  
    } catch (error) {
      console.error('Error during registration:', error);
      res.status(500).send({ message: 'Server error' });
    }
  });
  
  
  router.post('/verify-otp', async (req, res) => {
    const { email, otp, password, first_name, second_name } = req.body;
  
    try {
      // Check if OTP exists for the email
      const [otpRecord] = await db.query('SELECT * FROM otp_verification WHERE email = ? AND otp = ?', [email, otp]);
  
      if (otpRecord.length === 0) {
        return res.status(400).send({ message: 'Invalid OTP' });
      }
  
      // Check if OTP has expired
      const otpCreatedAt = new Date(otpRecord[0].created_at);
      const expirationTime = 5 * 60 * 1000; // 5 minutes expiration time
      const currentTime = new Date();
  
      if (currentTime - otpCreatedAt > expirationTime) {
        return res.status(400).send({ message: 'OTP has expired' });
      }
  
      // OTP is valid, now save the user to the users table
      if ( !email|| !password || !first_name || !second_name) {
        return res.status(400).send({ message: 'Password, First Name, and Second Name are required' });
      }
  
      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10);
  
      await db.query('INSERT INTO users (email, password, first_name, second_name) VALUES (?, ?, ?, ?)', [
        email, 
        hashedPassword, 
        first_name, 
        second_name
      ]);
  
      // Delete OTP record from the otp_verification table
      await db.query('DELETE FROM otp_verification WHERE email = ?', [email]);
  
      res.status(200).send({ message: 'User registered successfully' });
  
    } catch (error) {
      console.error('Error during OTP verification:', error);
      res.status(500).send({ message: 'Server error' });
    }
  });
  

passport.use(
  new LocalStrategy(
    { usernameField: 'email' },
    async (email, password, done) => {
      try {
        const [user] = await db.query("SELECT * FROM users WHERE email = ?", [email]);

        if (user.length === 0) {
          return done(null, false, { message: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user[0].password);
        if (!isMatch) {
          return done(null, false, { message: "Invalid email or password" });
        }

        return done(null, user[0]);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// POST route to handle login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).send({ message: info.message });
    }

    try {
      // Generate OTP and save to the database
      const otp = generateOTP();
      await db.query("INSERT INTO otp_verification (email, otp) VALUES (?, ?)", [user.email, otp]);

      // Send OTP email
      await sendOTPEmail(user.email, otp);

      // Respond with a message indicating OTP has been sent
      res.status(200).send({ message: "Login successful. Please check your email for the OTP." });
    } catch (error) {
      console.error("OTP generation error:", error);
      res.status(500).send({ message: "Server error" });
    }
  })(req, res, next);
});

// OTP verification route
router.post('/verify-login-otp', async (req, res, next) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).send({ message: "Email and OTP are required" });
  }

  try {
    const [verification] = await db.query("SELECT * FROM otp_verification WHERE email = ? AND otp = ?", [email, otp]);

    if (verification.length === 0) {
      return res.status(400).send({ message: "Invalid OTP" });
    }

    // Retrieve the user from your database
    const [userResult] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (userResult.length === 0) {
      return res.status(400).send({ message: "User not found" });
    }
    const user = userResult[0];

    req.login(user, async (err) => {
      if (err) {
        return next(err);
      }
    
      req.session.user = {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        second_name: user.second_name,
      };
    
      console.log("Session data after login:", req.session);
    
      try {
        await new Promise((resolve, reject) => {
          req.session.save((saveErr) => {
            if (saveErr) return reject(saveErr);
            resolve();
          });
        });
    
        await db.query("DELETE FROM otp_verification WHERE email = ?", [email]);
    
        res.status(200).send({
          user: req.session.user, // Send user data in response
          message: "OTP verified successfully. You are now logged in.",
        });
      } catch (error) {
        console.error("Error during session save or OTP deletion:", error);
        return next(error);
      }
    });
    

  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).send({ message: "Server error" });
  }
});



  
// Send OTP and store it in the otp_verification table
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).send({ message: 'Email is required' });
  }

  try {
    // Check if email exists in the users table
    const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (user.length === 0) {
      return res.status(404).send({ message: 'Email not found' });
    }

    // Generate OTP
    const otp = generateOTP();

    // Check if OTP exists for the email, if it does, update it, otherwise insert a new entry
    const [existingOtp] = await db.query('SELECT * FROM otp_verification WHERE email = ?', [email]);

    if (existingOtp.length > 0) {
      // Update OTP if entry already exists
      await db.query('UPDATE otp_verification SET otp = ? WHERE email = ?', [otp, email]);
    } else {
      // Insert OTP if it's a new entry
      await db.query('INSERT INTO otp_verification (email, otp) VALUES (?, ?)', [email, otp]);
    }

    // Send OTP to email
    await sendOTPEmail(email, otp);

    res.status(200).send({ message: 'OTP sent to your email' });
  } catch (error) {
    console.error('Error during OTP sending:', error);
    res.status(500).send({ message: 'Server error' });
  }
});


// Reset password after OTP verification
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).send({ message: 'All fields are required' });
  }

  try {
    // Check if the OTP is valid
    const [verification] = await db.query('SELECT * FROM otp_verification WHERE email = ? AND otp = ?', [email, otp]);

    if (verification.length === 0) {
      return res.status(400).send({ message: 'Invalid OTP' });
    }

    // Check if the OTP has expired (assuming you store a timestamp for expiration)
    const currentTime = new Date();
    const otpTimestamp = new Date(verification[0].created_at); // Assuming `created_at` is in the table
    const timeDiff = (currentTime - otpTimestamp) / 1000; // Time difference in seconds
    if (timeDiff > 300) { // OTP expires after 5 minutes (300 seconds)
      return res.status(400).send({ message: 'OTP has expired' });
    }

    // Hash the new password before updating it
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password with the hashed password
    await db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);

    // Delete the OTP from the verification table after successful password reset
    await db.query('DELETE FROM otp_verification WHERE email = ?', [email]);

    res.status(200).send({ message: 'Password has been reset successfully' });
    
  } catch (error) {
    console.error('Error during password reset:', error);
    res.status(500).send({ message: 'Server error' });
  }
});

router.get("/check-session", (req, res) => {
  console.log("Session contents:", req.session);
  console.log("Passport session data:", req.session.passport);
  console.log("Authenticated user:", req.user);
  res.json({ user: req.isAuthenticated() ? req.user : null });
});


// This endpoint is for manual login session checks
router.get('/check-session-manual', (req, res) => {
  if (req.session && req.session.user) {
    return res.status(200).json({ user: req.session.user });
  } else {
    return res.status(401).json({ message: 'User not logged in manually' });
  }
});

// router.get("/test-session", (req, res) => {
//   console.log("Session ID:", req.sessionID);
//   console.log("User in session:", req.user);  // Log the user object

//   if (req.user) {
//     return res.json({ user: req.user });
//   } else {
//     return res.status(401).json({ message: "No user in session" });
//   }
// });


router.get('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.session.destroy((err) => {
      if (err) {
        return next(err);
      }
      res.status(200).json({ message: "Logged out successfully" });
    });
  });
});

export default router;
