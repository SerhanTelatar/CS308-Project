const request = require('supertest');
const express = require('express');
const admin = require('firebase-admin');
const router = require('../router/save'); // Assuming your app file is in the parent directory

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

describe('Save Routes', () => {
  const userId = '9fKpPcrHOGPHARWQJwzo';
  const musicId = 'JU5Xr0IwRk8vd8xHhzW9';

  it('should get saved music details for a user', async () => {
    const response = await request(app).get(`/save/${userId}`);
    setTimeout(() => {
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('musicDetails');
    }, 1050);
    
  });

  it('should save a music for a user', async () => {
    const response = await request(app).post(`/save/${userId}/save/${musicId}`);
    setTimeout(() => {
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', `Music ${musicId} saved for user ${userId}`);
    }, 1050);
    
  });

  it('should not save a music that is already saved', async () => {
    // Save the music first
    await request(app).post(`/save/${userId}/save/${musicId}`);

    // Try to save it again
    const response = await request(app).post(`/save/${userId}/save/${musicId}`);

    setTimeout(() => {
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Music already saved');  
    }, 1050);

  });

  it('should unsave a music for a user', async () => {
    // Save the music first
    await request(app).post(`/save/${userId}/save/${musicId}`);

    // Now unsave it
    const response = await request(app).delete(`/save/${userId}/unsave/${musicId}`);
    setTimeout(() => {
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', `Music ${musicId} removed from saved list for user ${userId}`);
    }, 1050);

  });

  it('should not unsave a music that is not in the saved list', async () => {
    const response = await request(app).delete(`/save/${userId}/unsave/${musicId}`);
    setTimeout(() => {
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Music not found in saved list');
    }, 1050);
    
  });
});
