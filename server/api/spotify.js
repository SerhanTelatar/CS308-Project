const express = require('express')
const router = express.Router()
const {spotifyApi} = require("../config/spotifyConfig")

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
        res.send('Success! You can now close the window.');

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
      const data = await spotifyApi.searchTracks(req.params.query);
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.get('/search-artists/:query', async (req, res) => {
    try {
      const data = await spotifyApi.searchArtists(req.params.query);
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.get('/search-tracks-by-artist/:query', async (req, res) => {
    try {
      const data = await spotifyApi.searchTracks(`artist:${req.params.query}`);
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.get('/search-tracks-by-artist-and-name/:artist/:track', async (req, res) => {
    try {
      const data = await spotifyApi.searchTracks(`track:${req.params.track} artist:${req.params.artist}`);
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.get('/search-playlists/:query', async (req, res) => {
    try {
      const data = await spotifyApi.searchPlaylists(req.params.query);
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
  
  router.get('/user-playlists/:id', async (req, res) => {
    try {
      const data = await spotifyApi.getUserPlaylists(req.params.id);
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.post('/create-playlist', async (req, res) => {
    try {
      const data = await spotifyApi.createPlaylist(req.body.name, { description: req.body.description, public: req.body.public });
      res.json({ message: 'Playlist created!', playlistId: data.body.id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.post('/add-tracks-to-playlist/:id', async (req, res) => {
    try {
      const data = await spotifyApi.addTracksToPlaylist(req.params.id, req.body.tracks);
      res.json({ message: 'Tracks added to playlist!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });

  // Following Users and Artists methods
router.get('/followed-artists', async (req, res) => {
    try {
      const data = await spotifyApi.getFollowedArtists({ limit: 1 });
      res.json({ total: data.body.artists.total, artists: data.body.artists.items });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.post('/follow-users', async (req, res) => {
    try {
      const data = await spotifyApi.followUsers(req.body.userIds);
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.post('/follow-artists', async (req, res) => {
    try {
      const data = await spotifyApi.followArtists(req.body.artistIds);
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.post('/unfollow-users', async (req, res) => {
    try {
      const data = await spotifyApi.unfollowUsers(req.body.userIds);
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.post('/unfollow-artists', async (req, res) => {
    try {
      const data = await spotifyApi.unfollowArtists(req.body.artistIds);
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.get('/is-following-users/:userIds', async (req, res) => {
    try {
      const data = await spotifyApi.isFollowingUsers(req.params.userIds.split(','));
      res.json({ isFollowing: data.body });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.get('/is-following-artists/:artistIds', async (req, res) => {
    try {
      const data = await spotifyApi.isFollowingArtists(req.params.artistIds.split(','));
      res.json({ isFollowing: data.body });
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
  
  router.get('/categories', async (req, res) => {
    try {
      const data = await spotifyApi.getCategories({
        limit: 5,
        offset: 0,
        country: 'SE',
        locale: 'sv_SE'
      });
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.get('/category/:categoryId', async (req, res) => {
    try {
      const data = await spotifyApi.getCategory(req.params.categoryId, {
        country: 'SE',
        locale: 'sv_SE'
      });
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.get('/playlists-for-category/:categoryId', async (req, res) => {
    try {
      const data = await spotifyApi.getPlaylistsForCategory(req.params.categoryId, {
        country: 'BR',
        limit: 2,
        offset: 0
      });
      res.json(data.body);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.get('/recommendations', async (req, res) => {
    try {
      const data = await spotifyApi.getRecommendations({
        min_energy: 0.4,
        seed_artists: ['6mfK6Q2tzLMEchAr0e9Uzu', '4DYFVNKZ1uixa6SQTvzQwJ'],
        min_popularity: 50
      });
      res.json(data.body);
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
  
  // Player methods
  router.get('/devices', async (req, res) => {
    try {
      const data = await spotifyApi.getMyDevices();
      res.json(data.body.devices);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.get('/current-playback-state', async (req, res) => {
    try {
      const data = await spotifyApi.getMyCurrentPlaybackState();
      res.json({ isPlaying: data.body.is_playing });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.get('/recently-played-tracks', async (req, res) => {
    try {
      const data = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 20 });
      res.json({ recentlyPlayed: data.body.items.map(item => item.track) });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  router.get('/current-playing-track', async (req, res) => {
    try {
      const data = await spotifyApi.getMyCurrentPlayingTrack();
      res.json({ nowPlaying: data.body.item.name });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });


// Add an Item to the User's Playback Queue
router.post('/add-to-queue', async (req, res) => {
    try {
      const data = await spotifyApi.addToQueue(req.body.trackUri);
      res.json({ message: 'Track added to the playback queue!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  // Pause a User's Playback
  router.put('/pause', async (req, res) => {
    try {
      await spotifyApi.pause();
      res.json({ message: 'Playback paused!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  // Seek To Position In Currently Playing Track
  router.put('/seek', async (req, res) => {
    try {
      const positionMs = req.body.positionMs || 0;
      await spotifyApi.seek(positionMs);
      res.json({ message: `Seek to ${positionMs} milliseconds!` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  // Set Repeat Mode On User’s Playback
  router.put('/set-repeat', async (req, res) => {
    try {
      const repeatMode = req.body.repeatMode || 'off';
      await spotifyApi.setRepeat(repeatMode);
      res.json({ message: `Repeat mode set to ${repeatMode}!` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  // Set Volume For User's Playback
  router.put('/set-volume', async (req, res) => {
    try {
      const volumePercent = req.body.volumePercent || 100;
      await spotifyApi.setVolume(volumePercent);
      res.json({ message: `Volume set to ${volumePercent}!` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  // Skip User’s Playback To Next Track
  router.post('/skip-to-next', async (req, res) => {
    try {
      await spotifyApi.skipToNext();
      res.json({ message: 'Skip to the next track!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  // Skip User’s Playback To Previous Track
  router.post('/skip-to-previous', async (req, res) => {
    try {
      await spotifyApi.skipToPrevious();
      res.json({ message: 'Skip to the previous track!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  // Start/Resume a User's Playback
  router.put('/play', async (req, res) => {
    try {
      await spotifyApi.play();
      res.json({ message: 'Playback started or resumed!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  // Toggle Shuffle For User’s Playback
  router.put('/toggle-shuffle', async (req, res) => {
    try {
      const shuffle = req.body.shuffle || false;
      await spotifyApi.setShuffle(shuffle);
      res.json({ message: `Shuffle is ${shuffle ? 'on' : 'off'}.` });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Something went wrong!' });
    }
  });
  
  // Transfer a User's Playback
  router.put('/transfer-playback', async (req, res) => {
    try {
      const deviceIds = req.body.deviceIds || [];
      await spotifyApi.transferMyPlayback(deviceIds);
      res.json({ message: 'Playback transferred to specified devices!' });
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

module.exports = router
