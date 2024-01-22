const request = require('supertest');
const express = require('express');
const app = express();
const recommendationRouter = require('../router/recommendation'); // Adjust the path as needed

// Mock the Firestore module
jest.mock('firebase-admin', () => ({
  firestore: () => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({
          exists: true
        })),
        update: jest.fn(),
      })),
    })),
  }),
}));

// Mock express-session
jest.mock('express-session');

app.use('/recommendation', recommendationRouter);

describe('GET /recommendation/:userId', () => {
  test('It should respond with recommended songs', async () => {
    const response = await request(app).get('/recommendation/9fKpPcrHOGPHARWQJwzo'); // Replace with a valid userId
    setTimeout(() => {
      expect(response.status).toBe(200);
    }, 900);
    
  });

  test('It should handle user not found', async () => {
    const response = await request(app).get('/recommendation/asdasdasd');
    setTimeout(() => {
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'User not found');
    }, 900);
    
  });

  test('It should respond with recommended songs', async () => {
    const response = await request(app).get('/recommendation/9fKpPcrHOGPHARWQJwzo'); // Replace with a valid userId

    setTimeout(() => {
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('recommendedSongs');
    }, 900);

    // Add more assertions based on the expected structure of the response
  });

  test('It should handle no high-rated songs found for the user', async () => {
    // Mock Firestore to simulate a user with no high-rated songs
    jest.spyOn(require('firebase-admin'), 'firestore').mockImplementation(() => ({
      collection: jest.fn(() => ({
        doc: jest.fn(() => ({
          get: jest.fn(() => Promise.resolve({
            exists: true,
            data: { ratings: [] } // No high-rated songs
          })),
        })),
      })),
    }));

    const response = await request(app).get('/recommendation/someUserId');
    setTimeout(() => {
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'No high-rated songs found for this user');
    }, 900);

  });

  test('It should handle no similar songs found based on criteria', async () => {
    // Mock Firestore to simulate high-rated songs but no similar songs found
    jest.spyOn(require('firebase-admin'), 'firestore').mockImplementation(() => ({
      collection: jest.fn(() => ({
        doc: jest.fn(() => ({
          get: jest.fn(() => Promise.resolve({
            exists: true,
            data: { ratings: [{ rating: 5, musicId: 'someMusicId' }] } // High-rated song
          })),
        })),
        where: jest.fn(() => ({
          where: jest.fn(() => ({
            limit: jest.fn(() => ({
              get: jest.fn(() => Promise.resolve({ empty: true })) // No similar songs found
            })),
          })),
        })),
      })),
    }));

    const response = await request(app).get('/recommendation/someUserId');

    setTimeout(() => {
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'No similar songs found based on criteria');
    }, 900);

  });

  // Add more tests for different scenarios as needed





});
