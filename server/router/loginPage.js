const express = require("express")
const router = express.Router()
const members = require("../Members")
const path = require('path');
const { exec } = require('child_process');

router.use(express.static(path.join(__dirname, 'public')));

router.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, '../public', 'index.html'))
})

router.post("/", async (req, res)=>{
    const {username, password} = req.body

    const user = members.find(member => member.name === username);

    if(user){
        if (user.password === password) {
            const userData = JSON.stringify(user);

            exec(`python recommend.py '${userData}'`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error: ${error}`);
                    return res.send('Error processing user data');
                }
                // Print the output from the Python script
                console.log('Python script output:', stdout);
                
                res.redirect('/home/:id');
            });

        }else{
            res.send('Login failed. Invalid password.');
        }

    }else{
        res.send('Login failed. User not found.');
    }
})

module.exports = router
