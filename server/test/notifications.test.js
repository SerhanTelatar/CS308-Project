const request = require('supertest');
const app = require('../router/notifications'); 

describe('GET /notificationsOfUser/:userId', () => {
  it('should fetch notifications for a user', async () => {
    const userId = '9fKpPcrHOGPHARWQJwzo'; 
    const response = await request(app).get(`/notificationsOfUser/${userId}`);
    expect(response.status).toBe(200);
    // Add more assertions to validate the response body, structure, etc.
  });

  it('should return an empty array if user has no notifications', async () => {
    const userId = '9fKpPcrHOGPHARWQJwzo'; // Replace with a user ID that has no notifications in your database
    const response = await request(app).get(`/notificationsOfUser/${userId}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]); // Assuming an empty array is expected for a user with no notifications
  });

  // Add more test cases for error handling, edge cases, etc.
});

describe('PUT /notificationsOfUser/close/:notificationId', () => {
  it('should close a notification', async () => {
    const notificationId = 'yourNotificationIdHere'; // Replace with an existing notification ID in your database
    const response = await request(app).put(`/notificationsOfUser/close/${notificationId}`);
    expect(response.status).toBe(200);
    // Add more assertions as needed
  });

  it('should return 404 if notification is not found', async () => {
    const notificationId = 'nonExistingNotificationId'; // Replace with a non-existing notification ID in your database
    const response = await request(app).put(`/notificationsOfUser/close/${notificationId}`);
    expect(response.status).toBe(404);
    // Add more assertions as needed
  });

  // Add more test cases for error handling, attempting to close already closed notifications, etc.
});

// Add similar test blocks for other routes or edge cases
