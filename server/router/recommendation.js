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
  
      // Find music IDs rated 4 or 5
      const highRatedMusicIds = ratings.filter(rating => rating.rating === 4 || rating.rating === 5)
                                       .map(rating => rating.musicId);
                            
      if (highRatedMusicIds.length === 0) {
        return res.json({ message: 'No high-rated songs found for this user' });
      }
  
      // Get music types for high-rated music IDs
      const musicRef = db.collection('music');
      const similarMusic = [];
  
      for (const musicId of highRatedMusicIds) {
        const musicDoc = await musicRef.doc(musicId).get();
  
        if (musicDoc.exists) {
          const musicData = musicDoc.data();
          const musicType = musicData.musicType;

          // Find similar music based on music type
          const similarMusicQuery = await musicRef.where('musicType', '==', musicType)
                                                  .where(admin.firestore.FieldPath.documentId(), '!=', musicId)
                                                  .limit(10)
                                                  .get();
  
          similarMusicQuery.forEach(doc => {
            similarMusic.push({
              id: doc.id,
              data: doc.data()
            });
          });
        }
      }
  
      // If user has rated more than one high-rated song, shuffle the recommended songs
      if (highRatedMusicIds.length > 1) {
        similarMusic.sort(() => Math.random() - 0.5);
      }
  
      res.json({ recommendedSongs: similarMusic });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  
  
  

module.exports = router