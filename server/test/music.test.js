const request = require('supertest');
const express = require('express');
const admin = require('firebase-admin');
const router = require('../router/music'); 

// Mocking Firebase admin
jest.mock('firebase-admin', () => ({
  firestore: () => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(() => ({
          exists: true,
          data: () => ({
            // Sample music data for mocking
            musicName: 'Test Music',
            musicType: 'Test Type',
            artist: 'Test Artist',
            addedByUserId: 'testUserId',
          }),
        })),
        delete: jest.fn(),
        add: jest.fn(() => ({
          id: 'newMusicId',
        })),
        update: jest.fn(),
      })),
      where: jest.fn(() => ({
        get: jest.fn(() => ({
          forEach: jest.fn(),
        })),
      })),
    })),
  }),
}));

const app = express();
app.use(express.json());
app.use('/', router);

describe('Music Routes', () => {
  test('GET / should get all music from Firestore', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);
    // Add expectations based on the expected behavior of getting all music
  });

  test('GET /:id should get specific music by ID from Firestore', async () => {
    const response = await request(app).get('/testMusicId'); // Replace 'testMusicId' with a valid music ID

    expect(response.status).toBe(200);
    // Add expectations based on the expected behavior of getting specific music by ID
  });

  test('POST /add-music should add new music to Firestore', async () => {
    const newMusicData = {
      musicName: 'New Test Music',
      musicType: 'Test Type',
      artist: 'Test Artist',
      userId: 'testUserId',
    };

    const response = await request(app)
      .post('/add-music')
      .send(newMusicData);

    expect(response.status).toBe(200);
    // Add expectations based on the expected behavior of adding new music
  });

  test('GET /search-music/:text should search music from Firestore', async () => {
    const response = await request(app).get('/search-music/testText'); // Replace 'testText' with a sample search text

    expect(response.status).toBe(200);
    // Add expectations based on the expected behavior of searching music
  });

  test('DELETE /delete-music/:musicId/:userId should delete music from Firestore', async () => {
    const response = await request(app).delete('/delete-music/testMusicId/testUserId'); // Replace 'testMusicId' and 'testUserId' with valid IDs

    expect(response.status).toBe(200);
    // Add expectations based on the expected behavior of deleting music
  });
});
