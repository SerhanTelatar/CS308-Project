const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
const path = require('path');

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
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const recommendation = require("./router/recommendation")
const playlist = require("./router/playlist")
const csv = require("./router/csv")
const analysis = require("./router/analysis")

dotenv.config();
// Middleware
app.use(express.static(path.join(__dirname, 'web')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());

app.use(session({
  secret: 'yourSecretKey',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Adjust this as per your needs
}));


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
app.use("/recommendation", recommendation)
app.use("/playlist", playlist)
app.use("/csv", csv)
app.use("/analysis", analysis)

app.get('/register.css', (req, res) => {
  res.sendFile(path.join(__dirname, '../web/style', 'register.css'));
});

app.get('/register.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../web', 'register.js'));
});

app.get('/login.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../web', 'login.js'));
});

app.get('/logout.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../web', 'logout.js'));
});

app.get('/login.css', (req, res) => {
  res.sendFile(path.join(__dirname, '../web/style', 'login.css'));
});

app.get('/songs.css', (req, res) => {
  res.sendFile(path.join(__dirname, '../web/style', 'songs.css'));
});

app.get('/Logo.png', (req, res) => {
  res.sendFile(path.join(__dirname, '../web', 'Logo.png'));
});

app.get('/home.css', (req, res) => {
  res.sendFile(path.join(__dirname, '../web/style', 'home.css'));
});

app.get('/analysis.css', (req, res) => {
  res.sendFile(path.join(__dirname, '../web/style', 'analysis.css'));
});

app.get('/profile.css', (req, res) => {
  res.sendFile(path.join(__dirname, '../web', 'profile.css'));
});

app.get('/profile.jpeg', (req, res) => {
  res.sendFile(path.join(__dirname, '../web/style', 'profile.jpeg'));
});

app.get('/img.jpg', (req, res) => {
  res.sendFile(path.join(__dirname, '../web', 'img.jpg'));
});

app.get('/songs.js', (req, res) => {
  res.sendFile(path.join(__dirname, '../web', 'songs.js'));
}); 
app.get('/pic.png', (req, res) => {
  res.sendFile(path.join(__dirname, '../web', 'pic.png'));
});


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const port = process.env.PORT || 4200;

app.listen(port, () => {
  console.log('Server is running on', port);
});
