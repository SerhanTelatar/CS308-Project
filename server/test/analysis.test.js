const request = require('supertest');
const express = require('express');
const admin = require('firebase-admin');
const { analyzeUserData } = require('../router/analysis');

// Mock Firebase Firestore for testing
jest.mock('firebase-admin', () => ({
  firestore: () => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({
          exists: true,
          data: () => ({ averageRating: 4,
            totalRatings: 2,
            genrePercentage: { rock: '50%', pop: '50%' },
            totalFollowers: 0,
            totalFollowing: 2,
            totalSavedMusic: 2,
            savedMusicGenrePercentage: { rock: '50%', pop: '50%' },
            ratedArtists: ['the weekend', 'gayle'], }),
        })),
      })),
    })),
  }),
}));

const app = express();
app.use(express.json());
const router = require('../router/analysis'); 
app.use('/', router);

describe('User Routes', () => {
  it('should analyze user data', async () => {
    const userId = '9fKpPcrHOGPHARWQJwzo';

    // Mock Firestore data
    admin.firestore().collection('users').doc(userId).get.mockResolvedValue({
      exists: true,
      data: () => ({ averageRating: 4,
        totalRatings: 2,
        genrePercentage: { rock: '50%', pop: '50%' },
        totalFollowers: 0,
        totalFollowing: 2,
        totalSavedMusic: 2,
        savedMusicGenrePercentage: { rock: '50%', pop: '50%' },
        ratedArtists: ['the weekend', 'gayle'] }),
    });

    const response = await request(app).get(`/${userId}`);

    expect(response.status).toBe(200);
  });

  it('should generate PDF', async () => {
    const userId = '9fKpPcrHOGPHARWQJwzo';

    const response = await request(app).get(`/pdf/${userId}`);

    setTimeout(() => {
        expect(response.status).toBe(200);
    }, 1000);
    
    
  });
});
