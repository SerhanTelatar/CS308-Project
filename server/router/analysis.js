const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();
const PDFDocument = require('pdfkit');
const { IgApiClient } = require('instagram-private-api');
const { get } = require('request-promise');
const Jimp = require('jimp');

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
  //Share results on instagram
  router.post('/share/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Retrieve user data using the existing function
      const userDataResponse = await analyzeUserData(userId);
  
      // Share the story on Instagram
      await shareStoryOnInstagram(userDataResponse, userId);
  
      res.status(200).json({ message: 'Story shared successfully on Instagram' });
  
    } catch (error) {
      console.error('Error sharing story on Instagram:', error);
      res.status(500).json({ error: 'Failed to share story on Instagram' });
    }
  });

  

// Function to share a story on Instagram using user data
async function shareStoryOnInstagram(userDataResponse, userId) {
  try {
    // Initialize Instagram Private API client
    let ig = new IgApiClient(); // Change const to let

    const userCollection = admin.firestore().collection('users');
    const userDoc = await userCollection.doc(userId).get();

    const userData = userDoc.data();

    // Provide Instagram credentials (replace with your own credentials)
    const username = 'cs308riffy';
    const password = 'naber1234';

    // Login to Instagram
    await ig.state.generateDevice(username);
    await ig.account.login(username, password);

    // Initialize caption with basic user data
    let caption = `
      Username: ${userData.username}\n
      Average Rating: ${userDataResponse.averageRating}\n
      Total Ratings: ${userDataResponse.totalRatings}\n
      Total Followers: ${userDataResponse.totalFollowers}\n
      Total Following: ${userDataResponse.totalFollowing}\n
      Total Saved Music: ${userDataResponse.totalSavedMusic}\n
    `;

    // Add genre percentages to the caption
    caption += '\nGenre Percentages:';
    for (const genre in userDataResponse.genrePercentage) {
      caption += `\n  ${genre}: ${userDataResponse.genrePercentage[genre]}%`;
    }

    // Add saved music genre percentages to the caption
    caption += '\nSaved Music Genre Percentage:';
    for (const genre in userDataResponse.savedMusicGenrePercentage) {
      caption += `\n  ${genre}: ${userDataResponse.savedMusicGenrePercentage[genre]}%`;
    }

    // Add rated artists to the caption
    caption += '\nRated Artists:';
    userDataResponse.ratedArtists.forEach((artist) => {
      caption += `\n  ${artist}`;
    });

    const imageBuffer = await get({
      url: "http://localhost:4200/image",
      encoding: null,
    });

    const imageEdited = await Jimp.read(imageBuffer);
    const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

    const centerX = 100;
    let currentY = 100;
    const lineHeight = Jimp.measureTextHeight(font, "Test");

    // Split the caption into lines and add each line to the image
    caption.split('\n').forEach((line) => {
      imageEdited.print(font, centerX, currentY, line);
      imageEdited.print(font, centerX + 1, currentY + 1, line);
      currentY += lineHeight;
    });

    const editedBuffer = await imageEdited.getBufferAsync(Jimp.MIME_JPEG);

    // Publish the story with the edited image and caption
    const story = await ig.publish.story({
      file: editedBuffer,
      caption: "caption",
    });

    console.log('Story shared successfully');
  } catch (error) {
    console.error('Error sharing story on Instagram:', error);
    throw error;
  }
}




module.exports = router;
