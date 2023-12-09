const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const db = admin.firestore();

router.post('/create', async (req, res) => {
    try {
      const { userId, playlistName } = req.body;
  
      const playlistsRef = db.collection('playlists');
      const newPlaylistRef = await playlistsRef.add({
        userId: userId,
        playlistName: playlistName,
        musics: []
        // You can add more fields as needed
      });
  
      const playlistId = newPlaylistRef.id;
  
      // Add playlistId and userId to playlistBelongTo collection
      const playlistBelongToRef = db.collection('playlistBelongTo');
      await playlistBelongToRef.add({
        userId: userId,
        playlistId: playlistId
      });
  
      res.json({ success: true, message: 'Playlist created successfully', data: playlistId });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  

// Get all playlists for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    const playlistsRef = db.collection('playlists');
    const userPlaylists = await playlistsRef.where('userId', '==', userId).get();

    const playlists = [];
    userPlaylists.forEach((doc) => {
      playlists.push({ id: doc.id, ...doc.data() });
    });

    res.json({ success: true, data: playlists });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Search and get a specific playlist by ID
router.get('/:playlistId', async (req, res) => {
  try {
    const playlistId = req.params.playlistId;

    const playlistDoc = await db.collection('playlists').doc(playlistId).get();
    if (!playlistDoc.exists) {
      res.status(404).json({ success: false, message: 'Playlist not found' });
    } else {
      res.json({ success: true, data: { id: playlistDoc.id, ...playlistDoc.data() } });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Add a new music to a playlist
router.post('/:playlistId/add-music/', async (req, res) => {
    try {
      const { musicId } = req.body;

      const playlistId = req.params.playlistId;
      const playlistRef = db.collection('playlists').doc(playlistId);
      const playlistDoc = await playlistRef.get();
  
      if (!playlistDoc.exists) {
        res.status(404).json({ success: false, message: 'Playlist not found' });
        return;
      }
  
      const musicDoc = await db.collection('music').doc(musicId).get();
  
      if (!musicDoc.exists) {
        res.status(404).json({ success: false, message: 'Music not found' });
        return;
      }
  
      const musicData = musicDoc.data();
  
      // Update the playlist document to include the added music data
      const updatedMusics = playlistDoc.data().musics || []; // Get the existing musics or initialize as an empty array
      updatedMusics.push(musicData);
  
      await playlistRef.update({ musics: updatedMusics });
  
      res.json({ success: true, message: 'Music added to playlist successfully', data: musicData });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });
  

// Delete a playlist by ID for the current user
router.delete('/:playlistId', async (req, res) => {
  try {
    const playlistId = req.params.playlistId;

    await db.collection('playlists').doc(playlistId).delete();

    res.json({ success: true, message: 'Playlist deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
