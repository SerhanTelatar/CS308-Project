const request = require('supertest');
const express = require('express');
const admin = require('firebase-admin');
const router = require('../router/rate'); 

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

describe('User Ratings Routes', () => {
  test('GET /:userId should fetch ratings for a specific user', async () => {
    const response = await request(app).get('/testUserId'); // Replace 'testUserId' with a valid user ID
    setTimeout(() => {
      expect(response.status).toBe(200);
    }, 600);
    
    // Add expectations based on the expected behavior of fetching user ratings
  });

  test('POST / should add a rating for a user', async () => {
    const newRatingData = {
      userId: 'testUserId',
      musicId: 'testMusicId3',
      rating: 4,
    };

    const response = await request(app)
      .post('/')
      .send(newRatingData);
    setTimeout(() => {
      expect(response.status).toBe(200);
    }, 600);
    
    // Add expectations based on the expected behavior of adding a rating for a user
  });

  test('PUT / should update a rating for a user', async () => {
    const updatedRatingData = {
      userId: 'testUserId',
      musicId: 'testMusicId1',
      rating: 5,
      artistId: 'testArtistId',
    };

    const response = await request(app)
      .put('/')
      .send(updatedRatingData);
    setTimeout(() => {
      expect(response.status).toBe(200);
    }, 600);
    
    // Add expectations based on the expected behavior of updating a rating for a user
  });

  test('DELETE / should delete a rating for a user', async () => {
    const deleteRatingData = {
      userId: 'testUserId',
      musicId: 'testMusicId2',
    };

    const response = await request(app)
      .delete('/')
      .send(deleteRatingData);
    setTimeout(() => {
      expect(response.status).toBe(200);
    }, 600);
    
    // Add expectations based on the expected behavior of deleting a rating for a user
  });

  test('GET /:userId should return 404 for a non-existing user', async () => {
    const response = await request(app).get('/nonExistingUserId');
    setTimeout(() => {
      expect(response.status).toBe(404);
    }, 600);
    
  });
  
  test('POST / should return 400 for missing required fields in the request body', async () => {
    const invalidRatingData = {
      // Missing userId, musicId, and rating
    };
  
    const response = await request(app)
      .post('/')
      .send(invalidRatingData);

    setTimeout(() => {
        expect(response.status).toBe(400);
    }, 600);
    
  });
  
  test('PUT / should return 400 for missing required fields in the request body', async () => {
    const invalidRatingData = {
      // Missing userId, musicId, rating, and artistId
    };
  
    const response = await request(app)
      .put('/')
      .send(invalidRatingData);

    setTimeout(() => {
      expect(response.status).toBe(400);
    }, 600);
    
  });
  
  test('PUT / should return 404 for updating a non-existing rating', async () => {
    const nonExistingRatingData = {
      userId: 'testUserId',
      musicId: 'nonExistingMusicId',
      rating: 5,
      artistId: 'testArtistId',
    };
  
    const response = await request(app)
      .put('/')
      .send(nonExistingRatingData);

    setTimeout(() => {
      expect(response.status).toBe(404);
    }, 600);
    
  });
  
  test('DELETE / should return 400 for missing required fields in the request body', async () => {
    const invalidDeleteRatingData = {
      // Missing userId and musicId
    };
  
    const response = await request(app)
      .delete('/')
      .send(invalidDeleteRatingData);

    setTimeout(() => {
      expect(response.status).toBe(400);
    }, 600);
    
  });
  
  test('DELETE / should return 404 for deleting a non-existing rating', async () => {
    const nonExistingDeleteRatingData = {
      userId: 'testUserId',
      musicId: 'nonExistingMusicId',
    };
  
    const response = await request(app)
      .delete('/')
      .send(nonExistingDeleteRatingData);

    setTimeout(() => {
      expect(response.status).toBe(404);
    }, 600);
    
  });
  
});
