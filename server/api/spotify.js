const express = require('express')
const router = express.Router()
const {spotifyApi} = require("../config/spotifyConfig")
const axios = require('axios');
const admin = require("firebase-admin");
const db = admin.firestore()

router.get('/', (req, res, next) => {
    res.redirect(spotifyApi.createAuthorizeURL([
        "ugc-image-upload",
        "user-read-recently-played",
        "user-read-playback-state",
        "user-top-read",
        "app-remote-control",
        "playlist-modify-public",
        "user-modify-playback-state",
        "playlist-modify-private",
        "user-follow-modify",
        "user-read-currently-playing",
        "user-follow-read",
        "user-library-modify",
        "user-read-playback-position",
        "playlist-read-private",
        "user-read-email",
        "user-read-private",
        "user-library-read",
        "playlist-read-collaborative",
        "streaming"
    ]))
})

let token = '';

router.get('/callback', async (req, res) => {
    try {
        const { error, code, state } = req.query;

        if (error) {
            throw new Error(`Callback Error: ${error}`);
        }

        // Exchange authorization code for access token and refresh token
        const tokenData = await spotifyApi.authorizationCodeGrant(code);
        const { access_token, refresh_token, expires_in } = tokenData.body;

        token = access_token

        // Set access token and refresh token
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);
        
        console.log('Access Token:', access_token);
        console.log('Refresh Token:', refresh_token);

        // Store the access token for later use

        console.log('Successfully retrieved access token. Expires in', expires_in, 's.');
        //res.send('Success! You can now close the window.');
        res.status(200).json({msg:'Success! You can now close the window.'});

        // Schedule token refresh
        setInterval(async () => {
            try {
                const refreshData = await spotifyApi.refreshAccessToken();
                const newAccessToken = refreshData.body['access_token'];

                console.log('Access token has been refreshed!');
                console.log('New Access Token:', newAccessToken);
                spotifyApi.setAccessToken(newAccessToken);

                // Update the stored token
                token = newAccessToken;
            } catch (refreshError) {
                console.error('Error refreshing access token:', refreshError);
            }
        }, expires_in / 2 * 1000);

        
    } catch (error) {
        console.error('Error during callback:', error.message);
        res.status(500).send(`Error during callback: ${error.message}`);
    }
});


// Example function to get album information
// Example route to get user information
router.get('/album/:id', async (req, res) => {
    try {
      const data = await spotifyApi.getAlbum(req.params.id);
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.get('/albums/:ids', async (req, res) => {
    try {
      const data = await spotifyApi.getAlbums(req.params.ids.split(','));
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.get('/artist/:id', async (req, res) => {
    try {
      const data = await spotifyApi.getArtist(req.params.id);
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });

  router.post('/artist/:id', async (req, res) => {
    try {
      const artistId = req.params.id;
      const artistData = await spotifyApi.getArtist(artistId);
  
      // Save the entire Spotify API response for the artist into Firestore
      await db.collection('artists').doc(artistId).set(artistData.body);
  
      res.json({ message: 'Artist data saved to artists collection in Firestore' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.get('/artists/:ids', async (req, res) => {
    try {
      const data = await spotifyApi.getArtists(req.params.ids.split(','));
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });

  router.get('/artist-albums/:id', async (req, res) => {
    try {
      const data = await spotifyApi.getArtistAlbums(req.params.id);
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.get('/search-tracks/:query', async (req, res) => {
    try {
      const limit = 10;
      const data = await spotifyApi.searchTracks(req.params.query, { limit });
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.get('/search-artists/:query', async (req, res) => {
    try {
      const limit = 10;
      const data = await spotifyApi.searchArtists(req.params.query, { limit });
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.get('/search-tracks-by-artist/:query', async (req, res) => {
    try {
      const limit = 10;
      const data = await spotifyApi.searchTracks(`artist:${req.params.query, { limit }}`);
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.get('/search-tracks-by-artist-and-name/:artist/:track', async (req, res) => {
    try {
      const limit = 10;
      const data = await spotifyApi.searchTracks(`track:${req.params.track} artist:${req.params.artist}`, { limit });
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.get('/search-playlists/:query', async (req, res) => {
    try {
      const limit = 10;
      const data = await spotifyApi.searchPlaylists(req.params.query, { limit });
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });

  router.get('/album-tracks/:id', async (req, res) => {
    try {
      const data = await spotifyApi.getAlbumTracks(req.params.id, { limit: 5, offset: 1 });
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.get('/artist-top-tracks/:id', async (req, res) => {
    try {
      const data = await spotifyApi.getArtistTopTracks(req.params.id, 'GB');
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.get('/related-artists/:id', async (req, res) => {
    try {
      const data = await spotifyApi.getArtistRelatedArtists(req.params.id);
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.get('/audio-features/:id', async (req, res) => {
    try {
      const data = await spotifyApi.getAudioFeaturesForTrack(req.params.id);
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.get('/audio-analysis/:id', async (req, res) => {
    try {
      const data = await spotifyApi.getAudioAnalysisForTrack(req.params.id);
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.get('/audio-features-for-tracks/:ids', async (req, res) => {
    try {
      const data = await spotifyApi.getAudioFeaturesForTracks(req.params.ids.split(','));
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });

  router.get('/user/:id', async (req, res) => {
    try {
      const data = await spotifyApi.getUser(req.params.id);
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.get('/me', async (req, res) => {
    try {
      const data = await spotifyApi.getMe();
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  // Playlist methods
  router.get('/playlist/:id', async (req, res) => {
    try {
      const data = await spotifyApi.getPlaylist(req.params.id);
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });

  router.get('/user-playlists', async (req, res) => {
    try {
      const data = await spotifyApi.getUserPlaylists();
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.get('/user-playlists/:id', async (req, res) => {
    try {
      const data = await spotifyApi.getUserPlaylists(req.params.id);
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });

  // Your Music library methods
  router.get('/my-saved-tracks', async (req, res) => {
    try {
      const data = await spotifyApi.getMySavedTracks({ limit: 2, offset: 1 });
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.post('/contains-my-saved-tracks', async (req, res) => {
    try {
      const data = await spotifyApi.containsMySavedTracks(req.body.trackIds);
      res.json({ trackIsInYourMusic: data.body[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.post('/remove-from-my-saved-tracks', async (req, res) => {
    try {
      const data = await spotifyApi.removeFromMySavedTracks(req.body.trackIds);
      res.json({ message: 'Tracks removed from Your Music!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.post('/add-to-my-saved-tracks', async (req, res) => {
    try {
      const data = await spotifyApi.addToMySavedTracks(req.body.trackIds);
      res.json({ message: 'Tracks added to Your Music!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.get('/my-saved-albums', async (req, res) => {
    try {
      const data = await spotifyApi.getMySavedAlbums({ limit: 1, offset: 0 });
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.post('/contains-my-saved-albums', async (req, res) => {
    try {
      const data = await spotifyApi.containsMySavedAlbums(req.body.albumIds);
      res.json({ albumIsInYourMusic: data.body[0] });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.post('/remove-from-my-saved-albums', async (req, res) => {
    try {
      const data = await spotifyApi.removeFromMySavedAlbums(req.body.albumIds);
      res.json({ message: 'Albums removed from Your Music!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.post('/add-to-my-saved-albums', async (req, res) => {
    try {
      const data = await spotifyApi.addToMySavedAlbums(req.body.albumIds);
      res.json({ message: 'Albums added to Your Music!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });

  // Browse methods
router.get('/new-releases', async (req, res) => {
    try {
      const data = await spotifyApi.getNewReleases({ limit: 5, offset: 0, country: 'SE' });
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.get('/featured-playlists', async (req, res) => {
    try {
      const data = await spotifyApi.getFeaturedPlaylists({
        limit: 3,
        offset: 1,
        country: 'SE',
        locale: 'sv_SE',
        timestamp: '2014-10-23T09:00:00'
      });
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
   
  router.get('/recommendations', async (req, res) => {
    try {
      // Fetch user's ratings from Firestore
      const userId = req.query.userId; 
      const userDoc = await admin.firestore().collection('users').doc(userId).get();
      
      if (!userDoc.exists) {
        return res.status(404).json({ error: 'User not found' });
      }

      const userData = userDoc.data();
      const { ratings } = userData;

      // Extract unique artist IDs from user's ratings
      const seedArtists = [...new Set(ratings.map((rating) => rating.artistId))];
      
      // Use the extracted artist IDs as seed_artists for Spotify recommendations
      const data = await spotifyApi.getRecommendations({
        seed_artists: seedArtists,
        limit: 5
      });

      res.json(data.body.tracks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  
  router.get('/available-genre-seeds', async (req, res) => {
    try {
      const data = await spotifyApi.getAvailableGenreSeeds();
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });

// Get a User’s Top Artists
router.get('/top-artists', async (req, res) => {
    try {
      const data = await spotifyApi.getMyTopArtists();
      const topArtists = data.body.items;
      res.json({ topArtists });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  // Get a User’s Top Tracks
  router.get('/top-tracks', async (req, res) => {
    try {
      const data = await spotifyApi.getMyTopTracks();
      const topTracks = data.body.items;
      res.json({ topTracks });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  // Get Album Details for Multiple Albums
  router.get('/album-details/:artistId', async (req, res) => {
    try {
      const artistId = req.params.artistId;
      const data = await spotifyApi.getArtistAlbums(artistId, { limit: 5 });
      const albumIds = data.body.items.map((album) => album.id);
      const albumDetails = await spotifyApi.getAlbums(albumIds);
      res.json({ albumDetails: albumDetails.body });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });

  const fetchPlaylistAndSaveFeatures = async (playlistId) => {
    try {
      // Fetch playlist details
      const playlistData = await spotifyApi.getPlaylist(playlistId);
      const tracks = playlistData.body.tracks.items;
  
      // Extract track IDs
      const trackIds = tracks.map((track) => track.track.id);
  
      // Fetch music features for each track ID
      const audioFeaturesData = await spotifyApi.getAudioFeaturesForTracks(trackIds);
  
      // Save music features to Firestore
      const audioFeaturesCollection = db.collection('audioFeatures');
      audioFeaturesData.body.audio_features.forEach(async (audioFeature) => {
        await audioFeaturesCollection.doc(audioFeature.id).set(audioFeature);
      });
  
      return { success: true, message: 'Music features saved to Firestore!' };
    } catch (error) {
      console.error(error);
      return { success: false, message: 'Failed to fetch or save music features.' };
    }
  };
  
  // Usage: Call this function with a playlist ID to save music features to Firestore
  router.get('/save-music-features/:playlistId', async (req, res) => {
    try {
      const playlistId = req.params.playlistId;
      const result = await fetchPlaylistAndSaveFeatures(playlistId);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });

  router.get('/song/:id', async (req, res) => {
    try {
      const trackId = req.params.id;
      const data = await spotifyApi.getTrack(trackId);
      const songName = data.body.name;
      res.json({ songName });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });

router.get('/search-music', async (req, res) => {
  try {
      const searchText = req.query.text;
      
      // Search for tracks based on the provided text
      const data = await spotifyApi.searchTracks(searchText, { limit: 10 });

      // Extract relevant information for the 10 tracks found
      const tracks = data.body.tracks.items.map((track) => {
          return {
              name: track.name,
              artists: track.artists.map((artist) => artist.name).join(', '),
              album: track.album.name,
              preview_url: track.preview_url, // This may be null if there's no preview available
          };
      });
  
      res.json(tracks);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
  }
});

router.post('/save-music/:id', async (req, res) => {
  try {
      const trackId = req.params.id;

      // Fetch the details of the track using the provided track ID
      const trackData = await spotifyApi.getTrack(trackId);
      const trackDetails = {name: trackData.body.name.toLowerCase()};

      // Reference the Firestore collection where you want to store the tracks
      const tracksCollection = db.collection('music');

      // Save the track details to Firestore using the track ID as the document ID
      await tracksCollection.doc(trackId).set(trackDetails);

      res.json({ message: 'Music track saved to Firestore!' });
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
  }
});


module.exports = router
