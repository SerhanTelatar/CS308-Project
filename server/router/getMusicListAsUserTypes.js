// routes/searchRouter.js

const express = require('express');
const fetch = require('node-fetch');
const { spotifyApi } = require('../config/spotifyConfig'); // Adjust the path based on your project structure

const router = express.Router();

// Search function
async function search(query) {
  const type = 'album,artist,track'; // Specify the item types to search across
  const limit = 50; // Specify the maximum number of results

  try {
    const response = await spotifyApi.search(query, { type, limit });

    return response.body.tracks.items;
  } catch (error) {
    throw new Error(`Error fetching data from Spotify API: ${error.message}`);
  }
}

// Endpoint for handling searches
router.post('/search', async (req, res) => {
  try {
    const query = req.body.query; // Assuming the search query is sent in the request body

    if (!query) {
      return res.status(400).json({ error: 'Search query is required.' });
    }

    const results = await search(query);
    res.json({ results });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
