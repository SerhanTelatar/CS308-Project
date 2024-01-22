const request = require('supertest');
const express = require('express');
const admin = require('firebase-admin');
const router = require('../router/notifications'); 


// Mocking Firebase admin
jest.mock('firebase-admin', () => ({
  firestore: () => ({
    collection: jest.fn(() => ({
      where: jest.fn(() => ({
        get: jest.fn(() => ({
          empty: true,
        })),
      })),
      add: jest.fn(() => ({
        id: '9fKpPcrHOGPHARWQJwzo',
      })),
    })),
  }),
}));

const app = express();
app.use(express.json());
app.use('/', router);

describe('GET /notificationsOfUser/:userId', () => {
  it('should fetch notifications for a user', async () => {
    const userId = '9fKpPcrHOGPHARWQJwzo'; 
    const response = await request(app).get(`/notificationsOfUser/${userId}`);
    setTimeout(() => {
      expect(response.status).toBe(200);
    }, 1200);
    
    // Add more assertions to validate the response body, structure, etc.
  });

  it('should return an empty array if user has no notifications', async () => {
    const userId = '9fKpPcrHOGPHARWQJwzo'; // Replace with a user ID that has no notifications in your database
    const response = await request(app).get(`/notificationsOfUser/${userId}`);
    setTimeout(() => {
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]); // Assuming an empty array is expected for a user with no notifications
    }, 1200);
    
  });

  it('should handle errors when fetching notifications', async () => {
    const userId = 'errorUser';
    const response = await request(app).get(`/notificationsOfUser/${userId}`);
    setTimeout(() => {
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    }, 1200);
  });

  it('should handle unexpected server errors during notification retrieval', async () => {
    // Mocking an unexpected error during the notification retrieval process
    jest.spyOn(admin, 'firestore').mockImplementation(() => ({
      collection: jest.fn(() => ({
        where: jest.fn(() => {
          throw new Error('Unexpected error during retrieval');
        }),
      })),
    }));

    const userId = 'unexpectedErrorUser';
    const response = await request(app).get(`/notificationsOfUser/${userId}`);
    setTimeout(() => {
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    }, 1200);
  });

});

describe('PUT /notificationsOfUser/close/:notificationId', () => {
  it('should close a notification', async () => {
    const notificationId = 'MFmDJI71dtVFOFyKslKE'; 
    const response = await request(app).put(`/notificationsOfUser/close/${notificationId}`);
    setTimeout(() => {
       expect(response.status).toBe(200);
    }, 1200);
    
  });

  it('should return 404 if notification is not found', async () => {
    const notificationId = 'ASasaSS123123';
    const response = await request(app).put(`/notificationsOfUser/close/${notificationId}`);
    setTimeout(() => {
      expect(response.status).toBe(404);
    }, 1200);

  });

  it('should handle errors when closing a notification', async () => {
    const notificationId = 'errorNotification';
    const response = await request(app).put(`/notificationsOfUser/close/${notificationId}`);
    setTimeout(() => {
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('error');
    }, 1200);
  });

 
});

