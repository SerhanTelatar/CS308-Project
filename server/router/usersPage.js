const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const path = require('path');

// GET all users
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../web', 'profile.html'));
  const userCollection = admin.firestore().collection('users');

  userCollection.get()
    .then((snapshot) => {
      const users = [];
      snapshot.forEach((doc) => {
        users.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      res.json(users);
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to fetch users' });
    });
});

// GET user by ID
router.get('/:id', (req, res) => {
  const userId = req.params.id;
  const userCollection = admin.firestore().collection('users');

  userCollection.doc(userId).get()
    .then((doc) => {
      if (doc.exists) {
        res.json({
          id: doc.id,
          ...doc.data(),
        });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to fetch user' });
    });
});

// GET user by username
router.get('/username/:username', (req, res) => {
  const username = req.params.username;
  const userCollection = admin.firestore().collection('users');

  userCollection.where('username', '==', username).get()
    .then((snapshot) => {
      if (!snapshot.empty) {
        const userData = snapshot.docs[0].data();
        res.json({
          id: snapshot.docs[0].id,
          ...userData,
        });
      } else {
        res.status(404).json({ error: 'User not found' });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: 'Failed to fetch user' });
    });
});

// you dont need it
// POST create a new user
router.post('/', (req, res) => {
  const { name, username, password } = req.body;
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
            res.json({ success: true, message: 'Registration successful', userId: docRef.id });
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

// Update user by ID
router.put('/:id', (req, res) => {
  const userId = req.params.id;
  const updatedData = req.body;
  const userCollection = admin.firestore().collection('users');

  userCollection.doc(userId).update(updatedData)
    .then(() => {
      res.json({ success: true, message: 'User updated successfully' });
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: 'Failed to update user' });
    });
});

router.delete('/:id', (req, res) => {
  const userId = req.params.id;
  const userCollection = admin.firestore().collection('users');

  userCollection.doc(userId).delete()
    .then(() => {
      res.json({ success: true, message: 'User deleted successfully' });
    })
    .catch((error) => {
      res.status(500).json({ success: false, message: 'Failed to delete user' });
    });
});

module.exports = router;