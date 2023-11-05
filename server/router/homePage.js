const express = require("express")
const router = express.Router()


const path = require('path');
router.use(express.static(path.join(__dirname, 'public')));

router.get("/:id", (req, res)=>{
    const id = req.params.id
    console.log(id)
    res.sendFile(path.join(__dirname, '../public', 'home.html'))
})


module.exports = router