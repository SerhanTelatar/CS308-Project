const express = require('express');
const router = express.Router();
const admin = require("firebase-admin");

const db = admin.firestore()

router.get("/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
  
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();
  
      if (!userDoc.exists) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const userData = userDoc.data();
      const savedMusics = userData.saved || [];
  
      // Fetch details of saved musics from the 'music' collection
      const musicDetails = [];
      for (const musicId of savedMusics) {
        const musicRef = db.collection('music').doc(musicId);
        const musicDoc = await musicRef.get();
  
        if (musicDoc.exists) {
          musicDetails.push({
            id: musicDoc.id,
            data: musicDoc.data()
          });
        }
      }
  
      res.json({ musicDetails });
    } catch (error) {
      console.error('Error fetching saved music details', error);
      res.status(500).json({ error: 'Error fetching saved music details' });
    }
  });
  
  
  router.post("/:userId/save/:musicId", async (req, res) => {
    try {
      const { userId, musicId } = req.params;
  
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();
  
      if (!userDoc.exists) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Get user's current saved musics array or initialize it if it doesn't exist
      const userData = userDoc.data();
      const savedMusics = userData.saved || [];
  
      // Check if the musicId is already in the saved list
      if (savedMusics.includes(musicId)) {
        return res.status(400).json({ message: 'Music already saved' });
      }
  
      // Add the musicId to the saved musics array
      savedMusics.push(musicId);
  
      // Update the user document with the updated saved musics array
      await userRef.update({ saved: savedMusics });
  
      res.json({ message: `Music ${musicId} saved for user ${userId}` });
    } catch (error) {
      console.error('Error saving music', error);
      res.status(500).json({ error: 'Error saving music' });
    }
  });

  router.delete("/:userId/unsave/:musicId", async (req, res) => {
    try {
      const { userId, musicId } = req.params;
  
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();
  
      if (!userDoc.exists) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      const userData = userDoc.data();
      let savedMusics = userData.saved || [];
  
      // Check if the musicId exists in the saved list
      if (!savedMusics.includes(musicId)) {
        return res.status(400).json({ message: 'Music not found in saved list' });
      }
  
      // Remove the musicId from the saved musics array
      savedMusics = savedMusics.filter((savedMusicId) => savedMusicId !== musicId);
  
      // Update the user document with the updated saved musics array
      await userRef.update({ saved: savedMusics });
  
      res.json({ message: `Music ${musicId} removed from saved list for user ${userId}` });
    } catch (error) {
      console.error('Error removing music from saved list', error);
      res.status(500).json({ error: 'Error removing music from saved list' });
    }
  });
  
  


module.exports = router