const express = require("express")
const router = express.Router()
const path = require('path');

const admin = require("../config/userDB");

router.use(express.static(path.join(__dirname, 'public')));

router.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, '../public', 'index.html'))
})

router.post('/', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    const userCollection = admin.firestore().collection('users');
  
    userCollection.where('username', '==', username).where('password', '==', password).get()
    .then((snapshot) => {
        if (!snapshot.empty) {
            res.json({ success: true, message: 'Login successful' });
        } else {
            res.status(401).json({ success: false, message: 'Login failed: Invalid username or password' });
        }
    })
    .catch((error) => {
        res.status(500).json({ success: false, message: 'Login failed: ' + error.message });
    });
});

module.exports = router
