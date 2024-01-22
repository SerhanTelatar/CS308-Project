const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();
const path = require('path');

const db = admin.firestore();

const isAuthenticated = (req, res, next) => {
  // Check the user's authentication status
  if (req.session && req.session.user) {
    // User is authenticated, proceed to the next middleware or route handler
    next();
  } else {
    // User is not authenticated, redirect to the login page or send an error response
    res.redirect('/login'); // You may customize this URL based on your login route
  }
};

// Apply the isAuthenticated middleware to all routes below
router.use(isAuthenticated);


router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../web/songs.html'));
});

// Get all music from Firestore at the "/music" path
router.get('/music', async (req, res) => {
  try {
    const userId = req.query.userId;
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


router.post('/add-music/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const { musicName, musicType, artist, isAlbum, albumName, personalRating } = req.body;

    const musicRef = db.collection('music');
    const lowercaseMusicType = musicType.toLowerCase();

    let parsedRating = null;
    if (personalRating !== undefined && personalRating !== null) {
      parsedRating = !isNaN(parseInt(personalRating)) ? parseInt(personalRating) : null;
    }

    const newMusicData = {
      musicName: musicName,
      musicType: lowercaseMusicType,
      artist: artist,
      addedByUserId: userId,
      isAlbum: isAlbum || false,
      albumName: isAlbum ? albumName || null : null,
      personalRating: parsedRating,
    };

    const newMusicRef = await musicRef.add(newMusicData);

    const listenToRef = db.collection('listenTo');

    await listenToRef.add({
      userId: userId,
      musicId: newMusicRef.id,
      // Add more fields related to listening activity if needed
    });

    if (parsedRating !== null) {
      const { rating } = req.body; // Assuming the rating is sent in the request body
      const userRef = db.collection('users').doc(userId);

      await userRef.update({
        ratings: admin.firestore.FieldValue.arrayUnion({ musicId: newMusicRef.id, rating: parsedRating }),
      });
    }

    res.json({ success: true, message: 'Music added successfully', data: newMusicRef });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// this search on firestore database (our database)
router.get('/search-music/:text', async (req, res) => {
  try {

    const searchText = req.params.text; // Convert search text to lowercase for case-insensitive search

    // Query Firestore for music starting with or containing the provided text (case-insensitive)
    const snapshot = await db.collection('music')
      .where("musicName", ">=", searchText)
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

router.delete('/delete-music/:musicId/:userId', async (req, res) => {
  try {
    const musicId = req.params.musicId;
    const userId = req.params.userId;

    // Assuming you have a 'music' collection in your Firestore
    const musicRef = db.collection('music').doc(musicId);

    // Get the document from Firestore
    const doc = await musicRef.get();

    if (!doc.exists) {
      res.status(404).json({ success: false, error: 'Music not found' });
    } else {
      const addedByUserId = doc.data().addedByUserId;

      // Check if the user deleting the music is the same as the user who added it
      if (addedByUserId === userId) {
        await musicRef.delete();
        res.json({ success: true, message: 'Music deleted successfully' });
      } else {
        res.status(403).json({ success: false, error: 'Permission denied. You cannot delete this music' });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});




module.exports = router;