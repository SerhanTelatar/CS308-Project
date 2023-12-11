const express = require("express");
const router = express.Router();
const path = require('path');

router.use(express.static(path.join(__dirname, '../../web', 'home.html')));

router.get("/", (req, res) => {
    // You can customize the response JSON object as needed
    res.json({ success: true, message: 'Home page data retrieved successfully', id: req.body.id });
});

module.exports = router;