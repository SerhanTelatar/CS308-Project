const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs'); 
const { Parser } = require('json2csv');

const db = admin.firestore();
const upload = multer({ dest: 'temp/' });

router.get('/export/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const userCollection = db.collection('users');
        const userDoc = await userCollection.doc(userId).get();

        if (!userDoc.exists) {
            return res.status(404).send('User not found.');
        }

        const userData = userDoc.data();

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(userData);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=user_${userId}_data.csv`);
        res.status(200).send(csv);
    } catch (error) {
        res.status(500).send(`Error exporting user data to CSV: ${error.message}`);
    }
});


router.post('/upload/:userId', upload.single('csvFile'), (req, res) => {
    const userId = req.params.userId;
    try {
      if (!req.file) {
        return res.status(400).send('No file uploaded.');
      }
  
      const results = [];
  
      // Parse the uploaded CSV file
      fs.createReadStream(req.file.path)
        .pipe(csvParser())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          // Process the parsed CSV data and save to the 'music' collection
          try {
            const batch = db.batch();
            const musicCollection = db.collection('music');
  
            results.forEach((music) => {
              const { musicName, musicType, artist } = music;
  
              const newMusicRef = musicCollection.doc(); // Create a new document reference
              batch.set(newMusicRef, {
                addedByUserId: userId,
                musicName: musicName,
                musicType: musicType,
                artist: artist
              });
            });
  
            // Commit the batch write
            await batch.commit();
  
            res.status(200).send('CSV file uploaded and data saved to music collection.');
          } catch (error) {
            res.status(500).send(`Error saving data to music collection: ${error.message}`);
          }
        });
    } catch (error) {
      res.status(500).send(`Error processing CSV file: ${error.message}`);
    }
  });

  router.get('/export/:userId/music', async (req, res) => {
    const userId = req.params.userId;

    try {
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userData = userDoc.data();
        const savedMusics = userData.saved || [];

        const musicDetails = [];
        for (const musicId of savedMusics) {
            const musicRef = db.collection('music').doc(musicId);
            const musicDoc = await musicRef.get();

            if (musicDoc.exists) {
                const musicData = musicDoc.data();
                musicDetails.push({
                    id: musicDoc.id,
                    musicName: musicData.musicName,
                    musicType: musicData.musicType,
                    artist: musicData.artist
                });
            }
        }

        // Convert musicDetails to CSV format
        const json2csvParser = new Parser({ fields: ['id', 'musicName', 'musicType', 'artist'] });
        const csv = json2csvParser.parse(musicDetails);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=user_${userId}_saved_music_data.csv`);
        res.status(200).send(csv);
    } catch (error) {
        console.error('Error exporting saved music data to CSV', error);
        res.status(500).json({ error: 'Error exporting saved music data to CSV' });
    }
});

  

  module.exports = router