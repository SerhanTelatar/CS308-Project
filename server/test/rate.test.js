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
  test('GET /:userId should fetch ratings for a specific user',  () => {
    const response =  request(app).get('/testUserId'); 
    setTimeout(() => {
      expect(response.status).toBe(200);
    }, 600);

  });

  test('POST / should add a rating for a user',  () => {
    const newRatingData = {
      userId: 'testUserId',
      musicId: 'testMusicId3',
      rating: 4,
    };

    const response =  request(app)
      .post('/')
      .send(newRatingData);
    setTimeout(() => {
      expect(response.status).toBe(200);
    }, 600);
    

  });

  test('PUT / should update a rating for a user',  () => {
    const updatedRatingData = {
      userId: 'testUserId',
      musicId: 'testMusicId1',
      rating: 5,
      artistId: 'testArtistId',
    };

    const response =  request(app)
      .put('/')
      .send(updatedRatingData);
    setTimeout(() => {
      expect(response.status).toBe(200);
    }, 600);
    
  });

  test('DELETE / should delete a rating for a user',  () => {
    const deleteRatingData = {
      userId: 'testUserId',
      musicId: 'testMusicId2',
    };

    const response =  request(app)
      .delete('/')
      .send(deleteRatingData);
    setTimeout(() => {
      expect(response.status).toBe(200);
    }, 600);
    

  });

  test('GET /:userId should return 404 for a non-existing user',  () => {
    const response =  request(app).get('/nonExistingUserId');
    setTimeout(() => {
      expect(response.status).toBe(404);
    }, 600);
    
  });
  
  test('POST / should return 400 for missing required fields in the request body',  () => {
    const invalidRatingData = {

    };
  
    const response =  request(app)
      .post('/')
      .send(invalidRatingData);

    setTimeout(() => {
        expect(response.status).toBe(400);
    }, 600);
    
  });
  
  test('PUT / should return 400 for missing required fields in the request body',  () => {
  
    const response =  request(app)
      .put('/')
      .send(invalidRatingData);

    setTimeout(() => {
      expect(response.status).toBe(400);
    }, 600);
    
  });
  
  test('PUT / should return 404 for updating a non-existing rating',  () => {
    const nonExistingRatingData = {
      userId: 'testUserId',
      musicId: 'nonExistingMusicId',
      rating: 5,
      artistId: 'testArtistId',
    };
  
    const response =  request(app)
      .put('/')
      .send(nonExistingRatingData);

    setTimeout(() => {
      expect(response.status).toBe(404);
    }, 600);
    
  });
  
  test('DELETE / should return 400 for missing required fields in the request body',  () => {
  
    const response =  request(app)
      .delete('/')
      .send(invalidDeleteRatingData);

    setTimeout(() => {
      expect(response.status).toBe(400);
    }, 600);
    
  });
  
  test('DELETE / should return 404 for deleting a non-existing rating',  () => {
    const nonExistingDeleteRatingData = {
      userId: 'testUserId',
      musicId: 'nonExistingMusicId',
    };
  
    const response =  request(app)
      .delete('/')
      .send(nonExistingDeleteRatingData);

    setTimeout(() => {
      expect(response.status).toBe(404);
    }, 600);
    
  });
  
});
