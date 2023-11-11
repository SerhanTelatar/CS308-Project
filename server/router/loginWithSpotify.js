//do not recommend to look

const express = require("express")
const router = express.Router()
var SpotifyWebApi = require('spotify-web-api-node')


var spotifyApi = new SpotifyWebApi({
  clientId: 'c94e69a2296a48c3a46856b11dd4acac',
  clientSecret: '20a5c69892f24740bb988c69721fcc0a',
  redirectUri: 'http://localhost:4200/loginWithSpotify/callback'
})

const token = "BQDOCEhrh0wByEKu6tT499m_pVjSnzUCh_FBlJ-gIdqI1g-9D60euGMm8zDgJusCMPR_-wFCIhlNOzeMNep6QzsJU_-97wk-waxNAlFQXweVutFlrX2Flb72JdWLzhDu_tXSfNdJ2R4lFz_LbT6Su7fQSnhyYekIN1GlRmosPaI4HjI7uowUz4IeHcrg6P9DtDVwliranSzXVll0LG2xmaZ50P898Q_RU3ebSFqwGKAuiE7cSneHhZGUl7_ALh2_1OoykwZyFfERKWFMn1A_MVhC10x0gkp6L7Vv8NJ1NPXZkeaFGAlm-OP-9JJAW1eDJRwRby8WmlKZ0IBlDbE_"

router.get('/', (req, res) => {
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

spotifyApi.getAccessToken(token)

router.get('/callback', (req, res, next) => {
    console.log(req.query)
    const code = req.query.code

    console.log("Authorization code received:", code)

    spotifyApi.authorizationCodeGrant(code).then((response) => {
        res.send(JSON.stringify(response));
    }).catch((error) => {
        console.error("Error during token exchange:", error)
        res.status(500).send("Error during token exchange")
    });
});


/*
const getMe = () =>{
    spotifyApi.getMe()
  .then(function(data) {
    console.log('Some information about the authenticated user', data.body);
  }, function(err) {
    console.log('Something went wrong!', err);
  });
}

getMe()
*/


module.exports = router