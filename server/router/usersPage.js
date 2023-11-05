const express = require("express")
const router = express.Router()
const members = require("../Members")

router.get("/", (req, res) =>{
    res.json(members)
})

router.get("/:id", (req, res) => {
    const { id } = req.params;

    const found = members.some(member => parseInt(id) === member.id);

    if (found) {
        const member = members.filter(member => parseInt(id) === member.id);
        res.json(member);
    } else {
        res.status(400).json({ msg: "No member with the id of " + id });
    }
});

module.exports = router