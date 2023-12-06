const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');

const loginPage = require('./router/loginPage');
const homePage = require('./router/homePage');
const usersPage = require('./router/usersPage');
const registerPage = require('./router/registerPage');
const spotifyAccount = require('./api/spotify');
const approve = require("./router/approve")
const getMusicListAsUserTypes = require('./router/getMusicListAsUserTypes');
const search = require("./router/getMusicListAsUserTypes")
const album = require("./router/album")
const music = require("./router/music")
const rate = require("./router/rate")
const artists = require("./router/artists")
const followFriends = require("./router/followFriends")


const dotenv = require('dotenv');
dotenv.config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
//app.use(morgan('combined')); // Logging middleware
//app.use(helmet()); // Security middleware

app.use('/login', loginPage);
app.use('/home', homePage);
app.use('/users', usersPage);
app.use('/register', registerPage);
app.use('/spotifyAccount', spotifyAccount);
app.use('/approve', approve);
app.use('/getMusicListAsUserTypes', getMusicListAsUserTypes);
app.use('/search', search)
app.use("/album", album)
app.use("/music", music)
app.use("/rate", rate)
app.use("/artists", artists)
app.use("/follow", followFriends)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const port = process.env.PORT || 4200;

app.listen(port, () => {
  console.log('Server is running on', port);
});
