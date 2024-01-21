const request = require('supertest');
const express = require('express');
const admin = require('firebase-admin');
const router = require('../router/save'); // Replace this with the path to your Express app setup

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

describe('GET /users/:userId', () => {
  it('should get saved music details for a user', async () => {
    const userId = '9fKpPcrHOGPHARWQJwzo'; // Replace with an existing user ID in your database
    const response = await request(app).get(`/users/${userId}`);
    setTimeout(() => {
      expect(response.status).toBe(200);
    }, 700);
    
    // Add more assertions to validate the response body, structure, etc.
  });

  it('should return 404 if user is not found', async () => {
    const userId = 'qqweqweqwqeqwe'; // Replace with a non-existing user ID in your database
    const response = await request(app).get(`/users/${userId}`);
    setTimeout(() => {
      expect(response.status).toBe(404);
    }, 700);
    
    // Add more assertions as needed
  });

  // Add more test cases for different scenarios (empty saved music, error cases, etc.)
});

describe('POST /users/:userId/save/:musicId', () => {
  it('should save music for a user', async () => {
    const userId = '9fKpPcrHOGPHARWQJwzo'; // Replace with an existing user ID in your database
    const musicId = 'JU5Xr0IwRk8vd8xHhzW9'; // Replace with an existing music ID in your database
    const response = await request(app).post(`/users/${userId}/save/${musicId}`);
    setTimeout(() => {
      expect(response.status).toBe(200);
    }, 700);
    
    // Add more assertions as needed
  });

  // Add more test cases for scenarios like trying to save already saved music, error cases, etc.
});

describe('DELETE /users/:userId/unsave/:musicId', () => {
  it('should remove saved music for a user', async () => {
    const userId = '9fKpPcrHOGPHARWQJwzo'; // Replace with an existing user ID in your database
    const musicId = 'JU5Xr0IwRk8vd8xHhzW9'; // Replace with an existing music ID in your database
    const response = await request(app).delete(`/users/${userId}/unsave/${musicId}`);
    setTimeout(() => {
      expect(response.status).toBe(200);
    }, 700);
    
    // Add more assertions as needed
  });

  // Add more test cases for scenarios like trying to remove non-existing music, error cases, etc.
});
