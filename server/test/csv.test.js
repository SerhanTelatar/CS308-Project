const request = require('supertest');
const express = require('express');
const admin = require('firebase-admin');
const router = require('../router/csv'); 

// Mocking Firebase admin
jest.mock('firebase-admin', () => ({
  firestore: () => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(() => ({
          exists: true,
          data: () => ({
            // Sample user data for mocking
            name: 'Test User',
            email: 'test@example.com',
            // Include fields that match the CSV parsing
            musicName: 'Sample Music',
            musicType: 'Sample Type',
            artist: 'Sample Artist',
          }),
        })),
      })),
    })),
    batch: jest.fn(() => ({
      set: jest.fn(),
      commit: jest.fn(),
    })),
  }),
}));

const app = express();
app.use(express.json());
app.use('/', router);

describe('Export and Upload Routes', () => {
  test('GET /export/:userId should export user data to CSV', async () => {
    const response = await request(app).get('/export/testUserId'); // Replace 'testUserId' with a valid user ID

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toBe('text/csv');
    expect(response.headers['content-disposition']).toBe('attachment; filename=user_testUserId_data.csv');
    // You can add more expectations based on the expected CSV content or structure
  });

  test('POST /upload/:userId should upload and process CSV file', async () => {
    const mockFile = {
      path: '/path/to/mock/file.csv',
    };

    const response = await request(app)
      .post('/upload/testUserId') // Replace 'testUserId' with a valid user ID
      .attach('csvFile', mockFile.path);

    expect(response.status).toBe(200);
    expect(response.text).toBe('CSV file uploaded and data saved to music collection.');
    // You can add more expectations based on the expected behavior after uploading the CSV
  });

  test('POST /upload/:userId should handle missing file', async () => {
    const response = await request(app).post('/upload/testUserId'); // Replace 'testUserId' with a valid user ID

    expect(response.status).toBe(400);
    expect(response.text).toBe('No file uploaded.');
  });
});
