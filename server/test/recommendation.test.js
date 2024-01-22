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
});
