const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const db = admin.firestore();

router.get('/:userId', async (req, res) => {
  try {
      const userId = req.params.userId;
      
      // Get user's ratings
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();
      
      if (!userDoc.exists) {
          return res.status(404).json({ error: 'User not found' });
      }
      
      const userData = userDoc.data();
      const ratings = userData.ratings || [];
      
      // Filter ratings based on criteria
      const highRatedMusicIds = ratings.filter(rating => rating.rating === 4 || rating.rating === 5)
          .map(rating => rating.musicId);
      
      if (highRatedMusicIds.length === 0) {
          return res.json({ message: 'No high-rated songs found for this user' });
      }
      
      const musicRef = db.collection('music');
      const similarMusic = [];
      
      // Helper functions to limit and shuffle recommendations
      const shuffleArray = array => array.sort(() => Math.random() - 0.5);
      const limitRecommendations = array => array.slice(0, 10);
      
      // Find music types for high-rated music IDs
      for (const musicId of highRatedMusicIds) {
          const musicDoc = await musicRef.doc(musicId).get();
          
          if (musicDoc.exists) {
              const musicData = musicDoc.data();
              const musicType = musicData.musicType;
              const artist = musicData.artist; // Assuming artist data is present in music document
              
              // Find similar music based on music type and artist
              const similarMusicQueryByType = await musicRef.where('musicType', '==', musicType)
                  .where(admin.firestore.FieldPath.documentId(), '!=', musicId)
                  .limit(5)
                  .get();
              
              similarMusicQueryByType.forEach(doc => {
                  similarMusic.push({
                      id: doc.id,
                      data: doc.data()
                  });
              });
              
              if (Array.isArray(artist)) {
                  // If artist data is an array, find music by each artist
                  for (const individualArtist of artist) {
                      const similarMusicQueryByArtist = await musicRef.where('artist', 'array-contains', individualArtist)
                          .where(admin.firestore.FieldPath.documentId(), '!=', musicId)
                          .limit(3)
                          .get();
                      
                      similarMusicQueryByArtist.forEach(doc => {
                          similarMusic.push({
                              id: doc.id,
                              data: doc.data()
                          });
                      });
                  }
              } else if (typeof artist === 'string') {
                  // If artist data is a string, find music by that artist
                  const similarMusicQueryByArtist = await musicRef.where('artist', '==', artist)
                      .where(admin.firestore.FieldPath.documentId(), '!=', musicId)
                      .limit(3)
                      .get();
                  
                  similarMusicQueryByArtist.forEach(doc => {
                      similarMusic.push({
                          id: doc.id,
                          data: doc.data()
                      });
                  });
              }
          }
      }
      
      // Shuffle and limit the recommendations
      if (similarMusic.length > 0) {
          shuffleArray(similarMusic);
          const limitedRecommendations = limitRecommendations(similarMusic);
          res.json({ recommendedSongs: limitedRecommendations });
      } else {
          res.json({ message: 'No similar songs found based on criteria' });
      }
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
  }
});

  
  

module.exports = router