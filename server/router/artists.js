const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const db = admin.firestore();


// Get all artists from Firestore
router.get('/', async (req, res) => {
  try {
    const artistsRef = db.collection('artists');
    const snapshot = await artistsRef.get();
    const artistsList = [];

    snapshot.forEach(doc => {
      artistsList.push({
        id: doc.id,
        data: doc.data()
      });
    });

    res.json(artistsList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a specific artist by ID from Firestore
router.get('/:id', async (req, res) => {
  const artistId = req.params.id;

  try {
    const artistRef = db.collection('artists').doc(artistId);
    const doc = await artistRef.get();

    if (!doc.exists) {
      res.status(404).json({ error: 'Artist not found' });
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

router.get('/search-artists/:text', async (req, res) => {
  try {
    const searchText = req.params.text.toLowerCase().toString(); // Convert search text to lowercase for case-insensitive search
  
    // Query Firestore for artists starting with or containing the provided text (case-insensitive)
    const snapshot = await db.collection('artists')
      .where('name', '>=', searchText)
      .where('name', '<=', searchText + '\uf8ff')
      .limit(10)
      .get();

    const artists = [];
    snapshot.forEach(doc => {
      const artist = doc.data();
      artists.push(artist);
    });
  
    if (artists.length === 0) {
      // Log the search text if no artists are found
      console.log(`No artists found for: ${searchText}`);
    }
  
    res.json(artists);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong!' });
  }
});

module.exports = router;
