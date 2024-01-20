const express = require('express');
const router = express.Router();
const axios = require('axios');

const imageUrl = 'https://images.wallpaperscraft.com/image/single/gradient_multicolored_color_153151_1080x1920.jpg';

// Endpoint to serve the image
router.get('/', async (req, res) => {
  try {
    // Fetch the image from the URL
    const response = await axios.get(imageUrl, { responseType: 'stream' });

    // Set the appropriate content type for the response
    res.setHeader('Content-Type', response.headers['content-type']);

    // Pipe the image stream to the response object
    response.data.pipe(res);
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({ error: 'Failed to serve image' });
  }
});

module.exports = router
