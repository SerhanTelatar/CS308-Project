const express = require('express');
const admin = require('firebase-admin');
const router = express.Router();

const db = admin.firestore();


router.get('/:userId', async (req, res) => {
    const { userId } = req.params;
  
    try {
      const notificationsOfUserRef = db.collection('notificationsOfUser')
        .where('userID', '==', userId);
  
      const notificationsOfUserSnapshot = await notificationsOfUserRef.get();
  
      const notificationsList = [];
      for (const doc of notificationsOfUserSnapshot.docs) {
        const notificationId = doc.data().notificationID;
        const notificationDoc = await db.collection('notifications').doc(notificationId).get();
  
        if (notificationDoc.exists) {
          const notificationData = notificationDoc.data();
          if (!notificationData.isClosed) {
            notificationsList.push({
              id: notificationDoc.id,
              data: notificationData
            });
          }
        }
      }
  
      res.json(notificationsList);
    } catch (error) {
      console.error('Error fetching notifications', error);
      res.status(500).json({ error: 'Error fetching notifications' });
    }
  });
  

  router.put('/close/:notificationId', async (req, res) => {
    const { notificationId } = req.params;
  
    try {
      const notificationRef = db.collection('notifications').doc(notificationId);
      const notificationDoc = await notificationRef.get();
  
      if (!notificationDoc.exists) {
        return res.status(404).json({ message: 'Notification not found' });
      }
  
      // Update the isClosed field to true
      await notificationRef.update({ isClosed: true });
  
      res.json({ message: `Notification ${notificationId} closed` });
    } catch (error) {
      console.error('Error closing notification', error);
      res.status(500).json({ error: 'Error closing notification' });
    }
  });
  

module.exports = router