const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();
const multer = require('multer');
const csvParser = require('csv-parser');

const db = admin.firestore();

const upload = multer({ dest: 'temp/' });

router.post('/upload', upload.single('csvFile'), (req, res) => {
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
                musicName: musicName,
                musicType: musicType,
                artist: artist
                // Add more fields as needed
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
  

  module.exports = router