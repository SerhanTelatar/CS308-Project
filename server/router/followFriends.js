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
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userFollowingIds = userDoc.data().following || [];
    const followingList = [];

    // Retrieve details of each user that the current user is following
    for (const followingId of userFollowingIds) {
      const followingUserRef = db.collection('users').doc(followingId);
      const followingUserDoc = await followingUserRef.get();

      if (followingUserDoc.exists) {
        followingList.push(
            followingUserDoc.id
        );
      }
    }

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
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userFollowersIds = userDoc.data().followers || [];
    const followersList = [];

    // Retrieve details of each user following the current user
    for (const followerId of userFollowersIds) {
      const followerUserRef = db.collection('users').doc(followerId);
      const followerUserDoc = await followerUserRef.get();

      if (followerUserDoc.exists) {
        followersList.push({
          id: followerUserDoc.id
        });
      }
    }

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
  
      // Create a notification for the friend to accept or reject the follow request
      const notificationData = {
        type: 'follow_request',
        from: userId,
        to: friendId,
        status: 'pending', // Status can be 'pending', 'accepted', or 'rejected'
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        isClosed: false
      };
  
      const notificationRef = db.collection('notifications').doc();
  
      await notificationRef.set(notificationData);
  
      // Save to notificationsOfUser to associate this notification with the friend
      await db.collection('notificationsOfUser').add({
        userID: friendId,
        notificationID: notificationRef.id,
        status: 'pending', // Status for the friend's view
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        type: 'follow_request'
      });
  
      res.json({ message: `Follow request sent from (${userId}) to friend (${friendId})` });
    } catch (error) {
      console.error('Error sending follow request', error);
      res.status(500).json({ error: 'Error sending follow request' });
    }
  });
  
  router.post('/accept/:notificationId', async (req, res) => {
    const { notificationId } = req.params;
  
    try {
      const notificationRef = db.collection('notifications').doc(notificationId);
      const notificationDoc = await notificationRef.get();
  
      if (!notificationDoc.exists) {
        return res.status(404).json({ message: 'Notification not found' });
      }
  
      const { from: userId, to: friendId } = notificationDoc.data();
  
      // Update the user's 'following' list by adding the friend's ID
      const userRef = db.collection('users').doc(userId);
      const userDoc = await userRef.get();
      const userFollowing = userDoc.data().following || [];
      if (!userFollowing.includes(friendId)) {
        userFollowing.push(friendId);
        await userRef.update({ following: userFollowing });
      }
  
      // Update the friend's 'followers' list by adding the user's ID
      const friendRef = db.collection('users').doc(friendId);
      const friendDoc = await friendRef.get();
      const friendFollowers = friendDoc.data().followers || [];
      if (!friendFollowers.includes(userId)) {
        friendFollowers.push(userId);
        await friendRef.update({ followers: friendFollowers });
      }
  
      // Update the notification status to 'accepted'
      await notificationRef.update({ status: 'accepted' });
  
      res.json({ message: 'Follow request accepted' });
    } catch (error) {
      console.error('Error accepting follow request', error);
      res.status(500).json({ error: 'Error accepting follow request' });
    }
  });
  
  
  
  router.post('/reject/:notificationId', async (req, res) => {
    const { notificationId } = req.params;
  
    try {
      const notificationRef = db.collection('notifications').doc(notificationId);
      await notificationRef.update({ status: 'rejected' });
  
      res.json({ message: 'Follow request rejected' });
    } catch (error) {
      console.error('Error rejecting follow request', error);
      res.status(500).json({ error: 'Error rejecting follow request' });
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


  
  module.exports = router;
  
  