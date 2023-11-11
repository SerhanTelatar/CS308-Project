const express = require("express")
const router = express.Router()
const admin = require("firebase-admin");

router.get('/', (req, res) => {
  const userCollection = admin.firestore().collection('users');

  userCollection.get()
    .then((snapshot) => {
      const users = [];
      snapshot.forEach((doc) => {
        users.push(doc.data());
      });

      res.json(users);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to fetch users' });
    });
});

module.exports = router