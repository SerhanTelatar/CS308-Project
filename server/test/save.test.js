const request = require('supertest');
const app = require('../router/save'); // Replace this with the path to your Express app setup

describe('GET /users/:userId', () => {
  it('should get saved music details for a user', async () => {
    const userId = '9fKpPcrHOGPHARWQJwzo'; // Replace with an existing user ID in your database
    const response = await request(app).get(`/users/${userId}`);
    expect(response.status).toBe(200);
    // Add more assertions to validate the response body, structure, etc.
  });

  it('should return 404 if user is not found', async () => {
    const userId = 'nonExistingUserId'; // Replace with a non-existing user ID in your database
    const response = await request(app).get(`/users/${userId}`);
    expect(response.status).toBe(404);
    // Add more assertions as needed
  });

  // Add more test cases for different scenarios (empty saved music, error cases, etc.)
});

describe('POST /users/:userId/save/:musicId', () => {
  it('should save music for a user', async () => {
    const userId = '9fKpPcrHOGPHARWQJwzo'; // Replace with an existing user ID in your database
    const musicId = 'yourMusicIdHere'; // Replace with an existing music ID in your database
    const response = await request(app).post(`/users/${userId}/save/${musicId}`);
    expect(response.status).toBe(200);
    // Add more assertions as needed
  });

  // Add more test cases for scenarios like trying to save already saved music, error cases, etc.
});

describe('DELETE /users/:userId/unsave/:musicId', () => {
  it('should remove saved music for a user', async () => {
    const userId = '9fKpPcrHOGPHARWQJwzo'; // Replace with an existing user ID in your database
    const musicId = 'yourMusicIdHere'; // Replace with an existing music ID in your database
    const response = await request(app).delete(`/users/${userId}/unsave/${musicId}`);
    expect(response.status).toBe(200);
    // Add more assertions as needed
  });

  // Add more test cases for scenarios like trying to remove non-existing music, error cases, etc.
});
