const express = require("express");
const router = express.Router();
const path = require('path');
const admin = require("firebase-admin");
const nodemailer = require('nodemailer');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

// Input validation middleware
const validateInputs = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Invalid input data', errors: errors.array() });
  }
  next();
};

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'softwareenginnering46@gmail.com',
    pass: 'lyhy kodb jerw papa',
  },
});


// POST route to handle user registration
router.post("/", validateInputs, async (req, res) => {
  const { name, username, email, password } = req.body;
  const userCollection = admin.firestore().collection('users');

  try {
    // Check if username already exists
    const snapshot = await userCollection.where('username', '==', username).get();
    if (!snapshot.empty) {
      return res.status(400).json({ success: false, message: 'Username already exists. Please choose another username.' });
    }

    // Generate a salt
    const saltRounds = 10; // You can adjust this based on your security needs
    const salt = await bcrypt.genSalt(saltRounds);

    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Add the new user to Firestore
    const newUser = {
      name: name,
      username: username,
      email: email,
      password: hashedPassword,
      isApproved: false,
      ratings: [],
      followers: [],
      following: [],
      saved:[]
    };

    const docRef = await userCollection.add(newUser);

    console.log('User registered with ID:', docRef.id);

    // Send email for approval
    const approvalLink = `http://localhost:4200/approve/${docRef.id}`
    console.log(approvalLink)
    const mailOptions = {
      from: 'softwareenginnering46@gmail.com',
      to: req.body.email,
      subject: 'New User Registration for Approval',
      html: `<p>A new user has registered and is awaiting approval.</p><p>Please click <a href="${approvalLink}">here</a> to approve the registration.</p>`,
    };
    
    await transporter.sendMail(mailOptions);
    
    
    return res.status(201).json({ success: true, message: 'Registration successful. Awaiting approval.' });
  } catch (error) {
    console.error('Registration failed:', error.message);
    return res.status(500).json({ success: false, message: 'Registration failed: ' + error.message });
  }
});

module.exports = router;