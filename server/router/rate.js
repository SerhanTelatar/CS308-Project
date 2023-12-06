const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const db = admin.firestore();

router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Assuming your collection in Firestore is named "users"
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();
  
      if (!userDoc.exists) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const userData = userDoc.data();
      const ratings = userData.ratings || [];
  
      res.json({ ratings });
    } catch (error) {
      console.error('Error fetching ratings:', error);
      res.status(500).json({ error: 'Failed to fetch ratings' });
    }
  });
  

router.post('/', async (req, res) => {
    const { userId, musicId, rating , artistId} = req.body;

  try {
    // Assuming your collection in Firestore is named "users"
    const userRef = db.collection('users').doc(userId);

    // Update the user's document with the new rating and music ID
    await userRef.update({
      ratings: admin.firestore.FieldValue.arrayUnion({ musicId, rating , artistId}),
    });

    res.status(200).json({ message: 'Rating added successfully' });
  } catch (error) {
    console.error('Error adding rating:', error);
    res.status(500).json({ error: 'Failed to add rating' });
  }
  });


  router.put('/', async (req, res) => {
    const { userId, musicId, rating, artistId } = req.body;
  
    try {
      // Assuming your collection in Firestore is named "users"
      const userRef = db.collection('users').doc(userId);
  
      // Remove the existing rating for the specified musicId if it exists
      await userRef.update({
        ratings: admin.firestore.FieldValue.arrayRemove(
          { musicId: musicId }
        ),
      });
  
      // Add the updated rating for the specified musicId
      await userRef.update({
        ratings: admin.firestore.FieldValue.arrayUnion(
          { musicId, rating, artistId }
        ),
      });
  
      res.status(200).json({ message: 'Rating updated successfully' });
    } catch (error) {
      console.error('Error updating rating:', error);
      res.status(500).json({ error: 'Failed to update rating' });
    }
  });

  router.delete('/', async (req, res) => {
    const { userId, musicId } = req.body;
  
    try {
      // Assuming your collection in Firestore is named "users"
      const userRef = db.collection('users').doc(userId);
  
      // Remove the specified rating entry for the musicId
      await userRef.update({
        ratings: admin.firestore.FieldValue.arrayRemove(
          { musicId: musicId }
        ),
      });
  
      res.status(200).json({ message: 'Rating deleted successfully' });
    } catch (error) {
      console.error('Error deleting rating:', error);
      res.status(500).json({ error: 'Failed to delete rating' });
    }
  });
  

  module.exports = router;
  