const request = require('supertest');
const express = require('express');
const admin = require('firebase-admin');
const router = require('../router/music'); 



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

describe('Music Routes', () => {
  test('GET / should get all music from Firestore', async () => {
    const response = await request(app).get('/music');
    setTimeout(() => {
      expect(response.status).toBe(200);
    }, 550);
    
  });

  test('GET /:id should get specific music by ID from Firestore', async () => {
    const response = await request(app).get('/music/FtigVs7vmPGcsgCRvHNp'); 

    setTimeout(() => {
      expect(response.status).toBe(200);
    }, 1200);
  });

  test('POST /add-music should add new music to Firestore', async () => {
    const newMusicData = {
      musicName: 'arkadasim Esek',
      musicType: 'kids',
      artist: 'TBaris Manco',
      userId: 'user123',
    };

    const response = await request(app)
      .post('/add-music')
      .send(newMusicData);

      setTimeout(() => {
        expect(response.status).toBe(200);
      }, 1200);
    // Add expectations based on the expected behavior of adding new music
  });

  test('GET /search-music/:text should search music from Firestore', async () => {
    const response = await request(app).get('/search-music/testText'); // Replace 'testText' with a sample search text

    setTimeout(() => {
      expect(response.status).toBe(200);
    }, 1200);
    // Add expectations based on the expected behavior of searching music
  });

  test('DELETE /delete-music/:musicId/:userId should delete music from Firestore', async () => {
    const response = await request(app).delete('/delete-music/testMusicId/testUserId'); // Replace 'testMusicId' and 'testUserId' with valid IDs

    setTimeout(() => {
      expect(response.status).toBe(200);
    }, 1200);
    // Add expectations based on the expected behavior of deleting music
  });
});
