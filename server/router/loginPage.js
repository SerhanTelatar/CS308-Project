const express = require('express');
const router = express.Router();
const admin = require('../config/userDB');
const bcrypt = require('bcrypt');
const session = require('express-session');

router.get('/', async (req, res) => {
    const userData = req.session.user;

    if (req.session && req.session.user) {
        // User is logged in
        res.json({ success: true, message: 'User is logged in', userData });
    } else {
        // User is not logged in
        res.json({ success: false, message: 'User is not logged in' });
    }
});

router.post('/', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const userCollection = admin.firestore().collection('users');

    try {
        const userDoc = await userCollection.where('username', '==', username).get();

        if (!userDoc.empty) {
            const userData = userDoc.docs[0].data();
            const hashedPassword = userData.password;

            // Compare hashed password
            const passwordMatch = await bcrypt.compare(password, hashedPassword);

            // Compare plaintext password
            if (passwordMatch) {
                // Include user info in the response
                req.session.user = userData; // Set session data upon successful login
                res.json({
                    success: true,
                    message: 'Login successful',
                    username: userData,
                    id: userDoc.docs[0].id
                });
            } else {
                // Incorrect password
                res.status(401).json({ success: false, message: 'Login failed: Invalid username or password' });
            }
        } else {
            // User not found
            res.status(401).json({ success: false, message: 'Login failed: Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Login failed: ' + error.message });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            res.status(500).json({ success: false, message: 'Logout failed' });
        } else {
            res.clearCookie('connect.sid'); // Clear session cookie
            res.json({ success: true, message: 'Logout successful' });
        }
    });
});

module.exports = router;
