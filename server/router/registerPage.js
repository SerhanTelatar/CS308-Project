const express = require("express")
const router = express.Router()
const path = require('path')
const admin = require("firebase-admin"); // Import the Firebase app instance

router.use(express.static(path.join(__dirname, 'public')))

// Display the registration form
router.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'register.html'));
})

// Handle the registration form submission
router.post("/", (req, res) => {
    const name = req.body.name;
    const username = req.body.username
    const password = req.body.password

    const userCollection = admin.firestore().collection('users');
    userCollection.where('username', '==', username).get()
        .then((snapshot) => {
            if (!snapshot.empty) {
                res.send('Username already exists. Please choose another username.');
            } else {
                // Username is available, proceed with registration
                const newUser = {
                    name: name,
                    username: username,
                    password: password
                    // Add other user details as needed
                };

                userCollection.add(newUser)
                    .then((docRef) => {
                        console.log('User registered with ID: ', docRef.id);
                        res.redirect('/login'); // Redirect to the login page after successful registration
                    })
                    .catch((error) => {
                        res.send('Registration failed: ' + error.message);
                    });
            }
        })
        .catch((error) => {
            res.send('Registration failed: ' + error.message);
        });
});

module.exports = router

