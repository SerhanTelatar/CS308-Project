
const express = require("express");
const router = express.Router();
const path = require('path');

const isAuthenticated = (req, res, next) => {
  // Check the user's authentication status
  if (req.session && req.session.user) {
    // User is authenticated, proceed to the next middleware or route handler
    next();
  } else {
    // User is not authenticated, redirect to the login page or send an error response
    res.redirect('/login'); // You may customize this URL based on your login route
  }
};

// Apply the isAuthenticated middleware to all routes below
router.use(isAuthenticated);

// Serve the home.html file
router.get("/", (req, res) => {
  const userId = req.query.id;
  res.sendFile(path.join(__dirname, '../../web', 'home.html'));
});

module.exports = router;




/* const express = require("express");
const router = express.Router();
const path = require('path');


router.use(express.static(path.join(__dirname, '../../web', 'home.html')));

router.get("/", (req, res) => {
    // You can customize the response JSON object as needed
    res.json({ success: true, message: 'Home page data retrieved successfully', id: req.body.id });
});

module.exports = router; */