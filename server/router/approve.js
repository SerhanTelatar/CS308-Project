const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");

// GET route to handle user approval
router.get("/:id", async (req, res) => {
  const userId = req.params.id; // Use req.query.id to retrieve the user ID
  const userCollection = admin.firestore().collection('users');

  try {
    // Retrieve the user by ID
    const userDoc = await userCollection.doc(userId).get();

    if (!userDoc.exists) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const userData = userDoc.data();

    // Check if the user is already approved
    if (userData.isApproved) {
      return res.status(400).json({ success: false, message: 'User is already approved' });
    }

    // Update the user's approval status to true
    await userCollection.doc(userId).update({ isApproved: true });

    return res.status(200).json({ success: true, message: 'User approved successfully' });
  } catch (error) {
    console.error('Approval failed:', error.message);
    return res.status(500).json({ success: false, message: 'Approval failed: ' + error.message });
  }
});

module.exports = router;
