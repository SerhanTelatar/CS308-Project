const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const db = admin.firestore();

// Get all music from Firestore
router.get('/', async (req, res) => {
  try {
    const musicRef = db.collection('music');
    const snapshot = await musicRef.get();
    const musicList = [];

    snapshot.forEach(doc => {
      musicList.push({
        id: doc.id,
        data: doc.data()
      });
    });

    res.json(musicList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific music by ID from Firestore
router.get('/:id', async (req, res) => {
  const musicId = req.params.id;

  try {
    const musicRef = db.collection('music').doc(musicId);
    const doc = await musicRef.get();

    if (!doc.exists) {
      res.status(404).json({ error: 'Music not found' });
    } else {
      res.json({
        id: doc.id,
        data: doc.data()
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// this search on firestore database (our database)
router.get('/search-music/:text', async (req, res) => {
    try {
      
      const searchText = req.params.text; // Convert search text to lowercase for case-insensitive search
       
      // Query Firestore for music starting with or containing the provided text (case-insensitive)
      const snapshot = await db.collection('music')
        .where("name", ">=", searchText)
        .get();    
        


    const tracks = [];
    snapshot.forEach((doc) => {
    const track = doc.data();
        tracks.push(track);
    });
  
    if (tracks.length === 0) {
        // Log the search text if no tracks are found
        console.log(`No tracks found for: ${searchText}`);
    }
  
    res.json(tracks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
});


module.exports = router