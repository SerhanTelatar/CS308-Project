const express = require('express');
const router = express.Router();
const admin = require("firebase-admin");
const { spotifyApi } = require("../config/spotifyConfig");


const db = admin.firestore()
const albumsCollection = db.collection('albums');

// Route to get all albums
router.get('/', async (req, res) => {
  try {
    const snapshot = await albumsCollection.get();
    const albums = [];
    snapshot.forEach((doc) => {
      albums.push({
        id: doc.id,
        data: doc.data()
      });
    });
    res.status(200).json(albums);
  } catch (error) {
    res.status(500).send('Error getting albums: ' + error.message);
  }
});

// Route to get a single album by ID
router.get('/:id', async (req, res) => {
  const albumId = req.params.id;
  try {
    const albumDoc = await albumsCollection.doc(albumId).get();
    if (!albumDoc.exists) {
      res.status(404).send('Album not found');
    } else {
      res.status(200).json({
        id: albumDoc.id,
        data: albumDoc.data()
      });
    }
  } catch (error) {
    res.status(500).send('Error getting album: ' + error.message);
  }
});

router.get('/my-albums', (req, res) => {
    try {
      const data = spotifyApi.getMySavedAlbums({ limit: 50 }); // Adjust limit as needed
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });

router.post('/save-album/:id', async (req, res) => {
    try {
      const albumId = req.params.id;
  
      // Reference the Firestore collection where you want to store the albums
      const albumsCollection = db.collection('albums');
  
      // Save the album ID as a document in Firestore using the album ID as the document ID
      await albumsCollection.doc(albumId).set({ id: albumId });
  
      // Fetch detailed information about the album from Spotify using the album ID
      const albumData = await spotifyApi.getAlbum(albumId);
      const albumDetails = albumData.body; // Detailed information about the album
  
      // Save additional album details alongside the ID in your database
      await albumsCollection.doc(albumId).set(albumDetails, { merge: true });
  
      res.json({ message: 'Album details saved to the database!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });


module.exports = router;
