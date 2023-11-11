const express = require("express")
const router = express.Router()
const path = require('path')
const admin = require("firebase-admin");

router.use(express.static(path.join(__dirname, 'public')))

router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'register.html'));
})


router.post("/", (req, res) => {
    const name = req.body.name;
    const username = req.body.username
    const password = req.body.password

    const userCollection = admin.firestore().collection('users');
    userCollection.where('username', '==', username).get()
        .then((snapshot) => {
            if (!snapshot.empty) {
                res.status(400).json({ success: false, message: 'Username already exists. Please choose another username.' });
            } else {
                const newUser = {
                    name: name,
                    username: username,
                    password: password
                };

                userCollection.add(newUser)
                    .then((docRef) => {
                        console.log('User registered with ID: ', docRef.id);
                        res.json({ success: true, message: 'Registration successful' });
                    })
                    .catch((error) => {
                        res.status(500).json({ success: false, message: 'Registration failed: ' + error.message });
                    });
            }
        })
        .catch((error) => {
            res.status(500).json({ success: false, message: 'Registration failed: ' + error.message });
        });
});

module.exports = router

