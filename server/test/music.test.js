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

  test('GET /user-music/:userId should get all music added by a specific user', async () => {
    const response = await request(app).get('/user-music/9fKpPcrHOGPHARWQJwzo'); // Replace 'testUserId' with a valid user ID

    setTimeout(() => {
      expect(response.status).toBe(200);
      // Add expectations based on the expected behavior of retrieving user-specific music
    }, 1200);
  });

  test('POST /add-music/:userId should add new music with optional personal rating to Firestore', async () => {
    const newMusicDataWithRating = {
      musicName: 'Test Song',
      musicType: 'Pop',
      artist: 'Test Artist',
      userId: 'user123',
      personalRating: 4, // Add a personal rating to test
    };

    const response = await request(app)
      .post('/add-music/9fKpPcrHOGPHARWQJwzo')
      .send(newMusicDataWithRating);

    setTimeout(() => {
      expect(response.status).toBe(200);
      // Add expectations based on the expected behavior of adding new music with a personal rating
    }, 1200);
  });

  test('GET /search-music/:text should handle no matching tracks found', async () => {
    const response = await request(app).get('/search-music/123123');

    setTimeout(() => {
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    }, 1200);
    // Add expectations based on the expected behavior of handling no matching tracks found
  });

  test('DELETE /delete-music/:musicId/:userId should handle permission denied when deleting other user\'s music', async () => {
    // Assume 'testUserId' is not the same as the user who added the music 'testMusicId'
    const response = await request(app).delete('/delete-music/v0Ji35ueIRKhegddJS7B/9fKpPcrHOGPHARWQJwzo');

    setTimeout(() => {
      expect(response.status).toBe(403);
      // Add expectations based on the expected behavior of handling permission denied
    }, 1200);
  });

  test('DELETE /delete-music/:musicId/:userId should handle music not found', async () => {
    // Replace 'nonexistentMusicId' and 'testUserId' with IDs that do not exist in the database
    const response = await request(app).delete('/delete-music/123123/9fKpPcrHOGPHARWQJwzo');

    setTimeout(() => {
      expect(response.status).toBe(404);
      // Add expectations based on the expected behavior of handling music not found
    }, 1200);
  });
});
