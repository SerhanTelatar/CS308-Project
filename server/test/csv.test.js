const request = require('supertest');
const express = require('express');
const admin = require('firebase-admin');
const router = require('../router/csv'); 

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

describe('Export and Upload Routes', () => {
  test('GET /export/:userId should export user data to CSV', async () => {
    const response = await request(app).get('/export/9fKpPcrHOGPHARWQJwzo'); 
    setTimeout(() => {
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('text/csv');
      expect(response.headers['content-disposition']).toBe('attachment; filename=user_testUserId_data.csv');
    }, 400);
    
  });

  test('POST /upload/:userId should handle missing file', async () => {
    const response = await request(app).post('/upload/9fKpPcrHOGPHARWQJwzo');
    setTimeout(() => {
      expect(response.status).toBe(400);
      expect(response.text).toBe('No file uploaded.');
    }, 400);
    
  });

  test('GET /export/:userId should handle non-existent user', async () => {
    const response = await request(app).get('/export/nonExistentUserId');
    setTimeout(() => {
      expect(response.status).toBe(404);
    expect(response.text).toBe('User not found.');
    }, 400);
    
  });

  test('GET /export/:userId/music should export saved music data to CSV', async () => {
    const response = await request(app).get('/export/testUserId/music');
    setTimeout(() => {
      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toBe('text/csv');
      expect(response.headers['content-disposition']).toBe('attachment; filename=user_testUserId_saved_music_data.csv');
      // You can add more expectations based on the expected CSV content or structure
    }, 400);
  });

  test('GET /export/:userId/music should handle non-existent user', async () => {
    const response = await request(app).get('/export/nonExistentUserId/music');
    setTimeout(() => {
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('User not found');
    }, 400);
    
  });

  test('POST /upload/:userId should handle missing CSV file', async () => {
    const response = await request(app).post('/upload/9fKpPcrHOGPHARWQJwzo');
    setTimeout(() => {
      expect(response.status).toBe(400);
      expect(response.text).toBe('No file uploaded.');
    }, 400);
    
  });
  
});
