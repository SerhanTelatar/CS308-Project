var SpotifyWebApi = require('spotify-web-api-node')


var spotifyApi = new SpotifyWebApi({
  clientId: 'c94e69a2296a48c3a46856b11dd4acac',
  clientSecret: '20a5c69892f24740bb988c69721fcc0a',
  redirectUri: 'http://localhost:4200/spotifyAccount/callback'
})


module.exports = {spotifyApi}