const express = require("express");
const router = express.Router();
const path = require('path');
const admin = require("../config/userDB");
const bcrypt = require('bcrypt');

router.use(express.static(path.join(__dirname, 'public')));

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
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

module.exports = router;
