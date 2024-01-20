const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();
const PDFDocument = require('pdfkit');

const db = admin.firestore();

// Analyze user's ratings, followers, following, and saved music
router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Query Firestore to get user's ratings
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    const ratings = userData.ratings || [];
    const followers = userData.followers || [];
    const following = userData.following || [];
    const savedMusic = userData.saved || [];

    // Calculate the average rating
    const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = ratings.length === 0 ? 0 : totalRating / ratings.length;

    // Calculate the percentage of all rated music genres
    const genreCount = {};
    const totalRatings = ratings.length;

    for (const rating of ratings) {
      const musicId = rating.musicId;

      // Query Firestore to get music genre based on music ID
      const musicRef = db.collection('music').doc(musicId);
      const musicDoc = await musicRef.get();

      if (musicDoc.exists) {
        const genre = musicDoc.data().musicType || 'Unknown';
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      }
    }

    const genrePercentage = {};

    Object.keys(genreCount).forEach((genre) => {
      const percentage = (genreCount[genre] / totalRatings) * 100;
      genrePercentage[genre] = percentage.toFixed(2);
    });

    // Total followers, following, and saved music count
    const totalFollowers = followers.length;
    const totalFollowing = following.length;
    const totalSavedMusic = savedMusic.length;

    // Calculate the genre distribution of saved music
    const savedMusicGenreCount = {};
    
    for (const musicId of savedMusic) {
      const musicRef = db.collection('music').doc(musicId);
      const musicDoc = await musicRef.get();

      if (musicDoc.exists) {
        const genre = musicDoc.data().musicType || 'Unknown';
        savedMusicGenreCount[genre] = (savedMusicGenreCount[genre] || 0) + 1;
      }
    }

    const savedMusicGenrePercentage = {};

    Object.keys(savedMusicGenreCount).forEach((genre) => {
      const percentage = (savedMusicGenreCount[genre] / totalSavedMusic) * 100;
      savedMusicGenrePercentage[genre] = percentage.toFixed(2);
    });

    // Retrieve and list the names of artists whose music has been rated by the user
    const ratedArtists = new Set();

    for (const rating of ratings) {
      const musicId = rating.musicId;
      const musicRef = db.collection('music').doc(musicId);
      const musicDoc = await musicRef.get();

      if (musicDoc.exists) {
        const artist = musicDoc.data().artist || 'Unknown Artist';
        ratedArtists.add(artist);
      }
    }

    const artistList = Array.from(ratedArtists);

    res.json({
      averageRating,
      totalRatings,
      genrePercentage,
      totalFollowers,
      totalFollowing,
      totalSavedMusic,
      savedMusicGenrePercentage,
      ratedArtists: artistList
    });
  } catch (error) {
    console.error('Error analyzing user data:', error);
    res.status(500).json({ error: 'Failed to analyze user data' });
  }
});



router.get('/pdf/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;

    // Retrieve user data using the existing function
    const userDataResponse = await analyzeUserData(userId);

    // Create a new PDF document
    const doc = new PDFDocument();

    // Pipe the PDF document to the response object
    doc.pipe(res);

    // Set font and font size
    doc.font('Helvetica-Bold');
    doc.fontSize(18);

    // Add header
    doc.text(`User Data Analysis for UserId: ${userId}`, { align: 'center' });
    doc.moveDown(); // Add some space

    // Add subheading
    doc.fontSize(16);
    doc.text('Overview', { underline: true });
    doc.moveDown(); // Add some space

    // Add content to the PDF document
    doc.fontSize(14);
    doc.text(`Average Rating: ${userDataResponse.averageRating}`);
    doc.text(`Total Ratings: ${userDataResponse.totalRatings}`);
    doc.moveDown(); // Add some space

    // Iterate over genrePercentage and add content to PDF
    doc.text('Genre Percentages:');
    for (const genre in userDataResponse.genrePercentage) {
      doc.text(`  ${genre}: ${userDataResponse.genrePercentage[genre]}%`);
    }
    doc.moveDown(); // Add some space

    doc.text(`Total Followers: ${userDataResponse.totalFollowers}`);
    doc.text(`Total Following: ${userDataResponse.totalFollowing}`);
    doc.text(`Total Saved Music: ${userDataResponse.totalSavedMusic}`);
    doc.moveDown(); // Add some space

    // Iterate over savedMusicGenrePercentage and add content to PDF
    doc.text('Saved Music Genre Percentage:');
    for (const genre in userDataResponse.savedMusicGenrePercentage) {
      doc.text(`  ${genre}: ${userDataResponse.savedMusicGenrePercentage[genre]}%`);
    }
    doc.moveDown(); // Add some space

    doc.text('Rated Artists:');
    // Iterate over ratedArtists and add content to PDF
    userDataResponse.ratedArtists.forEach((artist) => {
      doc.text(`  ${artist}`);
    });
    
    // Finalize the PDF and end the response
    doc.end();

    // Set the content type for the response
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${userId}_userData.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
});


  async function analyzeUserData(userId) {

    // Query Firestore to get user's ratings
    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userData = userDoc.data();
    const ratings = userData.ratings || [];
    const followers = userData.followers || [];
    const following = userData.following || [];
    const savedMusic = userData.saved || [];

    // Calculate the average rating
    const totalRating = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    const averageRating = ratings.length === 0 ? 0 : totalRating / ratings.length;

    // Calculate the percentage of all rated music genres
    const genreCount = {};
    const totalRatings = ratings.length;

    for (const rating of ratings) {
      const musicId = rating.musicId;

      // Query Firestore to get music genre based on music ID
      const musicRef = db.collection('music').doc(musicId);
      const musicDoc = await musicRef.get();

      if (musicDoc.exists) {
        const genre = musicDoc.data().musicType || 'Unknown';
        genreCount[genre] = (genreCount[genre] || 0) + 1;
      }
    }

    const genrePercentage = {};

    Object.keys(genreCount).forEach((genre) => {
      const percentage = (genreCount[genre] / totalRatings) * 100;
      genrePercentage[genre] = percentage.toFixed(2);
    });

    // Total followers, following, and saved music count
    const totalFollowers = followers.length;
    const totalFollowing = following.length;
    const totalSavedMusic = savedMusic.length;

    // Calculate the genre distribution of saved music
    const savedMusicGenreCount = {};
    
    for (const musicId of savedMusic) {
      const musicRef = db.collection('music').doc(musicId);
      const musicDoc = await musicRef.get();

      if (musicDoc.exists) {
        const genre = musicDoc.data().musicType || 'Unknown';
        savedMusicGenreCount[genre] = (savedMusicGenreCount[genre] || 0) + 1;
      }
    }

    const savedMusicGenrePercentage = {};

    Object.keys(savedMusicGenreCount).forEach((genre) => {
      const percentage = (savedMusicGenreCount[genre] / totalSavedMusic) * 100;
      savedMusicGenrePercentage[genre] = percentage.toFixed(2);
    });

    // Retrieve and list the names of artists whose music has been rated by the user
    const ratedArtists = new Set();

    for (const rating of ratings) {
      const musicId = rating.musicId;
      const musicRef = db.collection('music').doc(musicId);
      const musicDoc = await musicRef.get();

      if (musicDoc.exists) {
        const artist = musicDoc.data().artist || 'Unknown Artist';
        ratedArtists.add(artist);
      }
    }

    const artistList = Array.from(ratedArtists);
    return {
      averageRating,
      totalRatings,
      genrePercentage,
      totalFollowers,
      totalFollowing,
      totalSavedMusic,
      savedMusicGenrePercentage,
      ratedArtists: artistList
    };
  }

module.exports = router;
