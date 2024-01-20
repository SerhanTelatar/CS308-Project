const request = require('supertest');
const app = require('../router/approve'); // Replace this with the path to your Express app setup

describe('GET /userApproval/:id', () => {
  it('should approve a user successfully', async () => {
    const userId = '9fKpPcrHOGPHARWQJwzo'; // Replace with an existing user ID in your database
    const response = await request(app).get(`/userApproval/${userId}`);
    expect(response.status).toBe(200);
    // Add assertions to validate the response body, structure, etc.
  });

  it('should return 404 if user is not found', async () => {
    const userId = '9fKpPcrHOGPHARWQJwzo'; // Replace with a non-existing user ID in your database
    const response = await request(app).get(`/userApproval/${userId}`);
    expect(response.status).toBe(404);
    // Add assertions as needed
  });

  it('should return 400 if user is already approved', async () => {
    const userId = '9fKpPcrHOGPHARWQJwzo'; // Replace with a user ID that is already approved in your database
    const response = await request(app).get(`/userApproval/${userId}`);
    expect(response.status).toBe(400);
    // Add assertions as needed
  });

  // Add more test cases for error handling, edge cases, etc.
});

