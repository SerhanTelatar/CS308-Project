const request = require('supertest');
const app = require('../router/usersPage'); // Replace this with the path to your Express app setup

describe('GET /users', () => {
  it('should fetch all users', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    // Add more assertions to validate the response body, structure, etc.
  });

  // Add more test cases for error handling, empty user list scenarios, etc.
});

describe('GET /users/:id', () => {
  it('should fetch a user by ID', async () => {
    const userId = '9fKpPcrHOGPHARWQJwzo'; // Replace with an existing user ID in your database
    const response = await request(app).get(`/users/${userId}`);
    expect(response.status).toBe(200);
    // Add more assertions to validate the response body, structure, etc.
  });

  it('should return 404 if user is not found', async () => {
    const userId = '9fKpPcrHOGPHARWQJwzo'; // Replace with a non-existing user ID in your database
    const response = await request(app).get(`/users/${userId}`);
    expect(response.status).toBe(404);
    // Add more assertions as needed
  });

  // Add more test cases for error handling, invalid ID formats, etc.
});

describe('GET /users/username/:username', () => {
  it('should fetch a user by username', async () => {
    const username = 'testUsername'; // Replace with an existing username in your database
    const response = await request(app).get(`/users/username/${username}`);
    expect(response.status).toBe(200);
    // Add more assertions to validate the response body, structure, etc.
  });

  it('should return 404 if username is not found', async () => {
    const username = 'nonExistingUsername'; // Replace with a non-existing username in your database
    const response = await request(app).get(`/users/username/${username}`);
    expect(response.status).toBe(404);
    // Add more assertions as needed
  });

  // Add more test cases for error handling, special characters in usernames, etc.
});

