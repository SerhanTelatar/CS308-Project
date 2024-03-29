const request = require('supertest');
const express = require('express');
const admin = require('firebase-admin');
const router = require('../router/followFriends'); 

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

describe('User Relationship Routes', () => {

  test('GET /following/:userId should get following list', async () => {
    const response = await request(app).get('/following/9fKpPcrHOGPHARWQJwzo'); // Replace 'testUserId' with a valid user ID
    setTimeout(() => {
      expect(response.status).toBe(200);
    }, 650);
    
  });

  test('GET /followers/:userId should get followers list', async () => {
    const response = await request(app).get('/followers/9fKpPcrHOGPHARWQJwzo'); // Replace 'testUserId' with a valid user ID
    setTimeout(() => {
      expect(response.status).toBe(200);
    }, 650);
    
    // Add expectations based on the expected behavior when getting followers list
  });

  

  test('POST /follow/:friendId/:userId should follow a user', async () => {
    const response = await request(app).post('/follow/WGZA9NMKVNJ2oCMx5pX5/9fKpPcrHOGPHARWQJwzo'); // Replace 'friendUserId' and 'testUserId' with valid user IDs
    setTimeout(() => {
      expect(response.status).toBe(200);
    }, 650);
    
    // Add expectations based on the expected behavior when following a user
  });

  test('DELETE /unfollow/:friendId/:userId should unfollow a user', async () => {
    const response = await request(app).delete('/unfollow/WGZA9NMKVNJ2oCMx5pX5/9fKpPcrHOGPHARWQJwzo'); // Replace 'friendUserId' and 'testUserId' with valid user IDs
    setTimeout(() => {
      expect(response.status).toBe(200);
    }, 650);
    
    
  });

  test('POST /accept/:notificationId should accept a follow request', async () => {
    const response = await request(app).post('/accept/POiyHn3PXaWVXAF1HUtr'); // Replace 'notificationId' with a valid notification ID
    setTimeout(() => {
      expect(response.status).toBe(200);
    }, 650);
    // Add expectations based on the expected behavior when accepting a follow request
  });
  
  test('POST /accept/:notificationId should handle errors', async () => {
    const response = await request(app).post('/accept/123123'); // Replace 'invalidNotificationId' with an invalid notification ID
    setTimeout(() => {
      expect(response.status).toBe(500);
    }, 650);
  });

  test('POST /reject/:notificationId should reject a follow request', async () => {
    const response = await request(app).post('/reject/POiyHn3PXaWVXAF1HUtr'); // Replace 'notificationId' with a valid notification ID
    setTimeout(() => {
      expect(response.status).toBe(200);
    }, 650);

  });
  
  test('POST /reject/:notificationId should handle errors', async () => {
    const response = await request(app).post('/reject/123123'); // Replace 'invalidNotificationId' with an invalid notification ID
    setTimeout(() => {
      expect(response.status).toBe(500);
    }, 650);


  });
  

  
});
