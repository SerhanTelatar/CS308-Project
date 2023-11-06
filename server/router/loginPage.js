const express = require("express")
const router = express.Router()
const path = require('path');



const admin = require("firebase-admin");
const serviceAccount = require('../adminKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://cs308-project-c7380-default-rtdb.firebaseio.com"
  });



router.use(express.static(path.join(__dirname, 'public')));

router.get("/", (req, res)=>{
    res.sendFile(path.join(__dirname, '../public', 'index.html'))

})

router.post('/', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    
    const userCollection = admin.firestore().collection('users')
  
    userCollection.where('username', '==', username).where('password', '==', password).get()
    .then((snapshot) => {
        if(!snapshot.empty){
            
            res.redirect('/home/');
        }else{
            res.send('Login failed: Invalid username or password')
        }
    })
    .catch((error) => {
        res.send('Login failed: ' + error.message)
      });
  });

module.exports = router
