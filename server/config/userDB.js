const admin = require('firebase-admin');
const serviceAccount = require('../adminKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://cs308-project-c7380-default-rtdb.firebaseio.com"
});

module.exports = admin