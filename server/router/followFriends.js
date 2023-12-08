const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const db = admin.firestore();

router.get('/search/:query', async (req, res) => {
  const { query } = req.params;

  try {
    // Query users based on username or name
    const usersSnapshot = await db.collection('users')
      .where('username', '>=', query) // Change 'username' to the actual field name for username
      .get();

    const userList = [];
    usersSnapshot.forEach((doc) => {
      userList.push({
        id: doc.id,
        data: doc.data()
      });
    });

    res.json(userList);
  } catch (error) {
    console.error('Error searching users', error);
    res.status(500).json({ error: 'Error searching users' });
  }
});

router.get('/following/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const userRef = db.collection('users').doc(userId);
      const followingSnapshot = await userRef.collection('following').get();
  
      const followingList = [];
      followingSnapshot.forEach((doc) => {
        followingList.push({
          id: doc.id,
          data: doc.data()
        });
      });
  
      res.json(followingList);
    } catch (error) {
      console.error('Error getting following list', error);
      res.status(500).json({ error: 'Error getting following list' });
    }
  });
  
  router.get('/followers/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const userRef = db.collection('users').doc(userId);
      const followersSnapshot = await userRef.collection('followers').get();
  
      const followersList = [];
      followersSnapshot.forEach((doc) => {
        followersList.push({
          id: doc.id,
          data: doc.data()
        });
      });
  
      res.json(followersList);
    } catch (error) {
      console.error('Error getting followers list', error);
      res.status(500).json({ error: 'Error getting followers list' });
    }
  });

  router.post('/follow/:friendId/:userId', async (req, res) => {
    const { friendId, userId } = req.params;
  
    try {
      // Reference to the user's document
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();
  
      if (!userDoc.exists) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Reference to the friend's document
      const friendRef = db.collection('users').doc(friendId);
      const friendDoc = await friendRef.get();
  
      if (!friendDoc.exists) {
        return res.status(404).json({ message: 'Friend not found' });
      }
  
      // Update the user's following list by adding the friend's ID
      const userFollowing = userDoc.data().following || [];
      if (!userFollowing.includes(friendId)) {
        userFollowing.push(friendId);
        await userRef.update({ following: userFollowing });
      }
  
      // Update the friend's followers list by adding the user's ID
      const friendFollowers = friendDoc.data().followers || [];
      if (!friendFollowers.includes(userId)) {
        friendFollowers.push(userId);
        await friendRef.update({ followers: friendFollowers });
      }

  
      res.json({ message: `You (${userId}) are now following friend (${friendId})` });
    } catch (error) {
      console.error('Error following friend', error);
      res.status(500).json({ error: 'Error following friend' });
    }
  });

  router.delete('/unfollow/:friendId/:userId', async (req, res) => {
    const { friendId, userId } = req.params;
  
    try {
      // Reference to the user's document
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();
  
      if (!userDoc.exists) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Reference to the friend's document
      const friendRef = db.collection('users').doc(friendId);
      const friendDoc = await friendRef.get();
  
      if (!friendDoc.exists) {
        return res.status(404).json({ message: 'Friend not found' });
      }
  
      // Remove the friend's ID from the user's following list
      let userFollowing = userDoc.data().following || [];
      userFollowing = userFollowing.filter(id => id !== friendId);
      await userRef.update({ following: userFollowing });
  
      // Remove the user's ID from the friend's followers list
      let friendFollowers = friendDoc.data().followers || [];
      friendFollowers = friendFollowers.filter(id => id !== userId);
      await friendRef.update({ followers: friendFollowers });
  
      res.json({ message: `You (${userId}) have unfollowed friend (${friendId})` });
    } catch (error) {
      console.error('Error unfollowing friend', error);
      res.status(500).json({ error: 'Error unfollowing friend' });
    }
  });
  
  module.exports = router
  