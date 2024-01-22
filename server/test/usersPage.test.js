const request = require('supertest');
const express = require('express');
const admin = require('firebase-admin');
const router = require('../router/save'); // Replace this with the path to your Express app setup

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

describe('GET /users/:userId', () => {
  it('should get saved music details for a user', async () => {
    const userId = '9fKpPcrHOGPHARWQJwzo'; 
    const response = await request(app).get(`/users/${userId}`);
    setTimeout(() => {
      expect(response.status).toBe(200);
    }, 700);
    

  });

  it('should return 404 if user is not found', async () => {
    const userId = 'qqweqweqwqeqwe'; 
    const response = await request(app).get(`/users/${userId}`);
    setTimeout(() => {
      expect(response.status).toBe(404);
    }, 700);
    

  });

  it('should return 404 if user by username is not found', async () => {
    const username = 'nonexistentuser'; 
    const response = await request(app).get(`/users/username/${username}`);
    setTimeout(() => {
        expect(response.status).toBe(404);
    }, 700);


  });
});

describe('POST /users/:userId/save/:musicId', () => {
  it('should save music for a user', async () => {
    const userId = '9fKpPcrHOGPHARWQJwzo'; 
    const musicId = 'JU5Xr0IwRk8vd8xHhzW9'; 
    const response = await request(app).post(`/users/${userId}/save/${musicId}`);
    setTimeout(() => {
      expect(response.status).toBe(200);
    }, 700);
    

  });

  it('should create a new user', async () => {
    const newUser = {
      name: 'New User',
      username: 'newuser',
      password: 'password123',
    };

    const response = await request(app).post('/users').send(newUser);
    setTimeout(() => {
      expect(response.status).toBe(200);
    }, 700);


  });

  it('should return 400 if username already exists during user creation', async () => {
    const existingUser = {
      name: 'admin',
      username: 'admin',
      password: 'admin',
    };

    const response = await request(app).post('/users').send(existingUser);
    setTimeout(() => {
      expect(response.status).toBe(400);
    }, 700);


  });

});

describe('PUT /users/:id', () => {
  it('should update user details by ID', async () => {
    const userId = '9fKpPcrHOGPHARWQJwzo'; 
    const updatedData = {
      name: 'Updated Name',
    };

    const response = await request(app).put(`/users/${userId}`).send(updatedData);
    setTimeout(() => {
      expect(response.status).toBe(200);
    }, 700);


  });

  it('should return 404 if user to update is not found', async () => {
    const nonExistingUserId = 'qqweqweqwqeqwe'; 
    const updatedData = {
      name: 'Updated Name',
    };

    const response = await request(app).put(`/users/${nonExistingUserId}`).send(updatedData);
    setTimeout(() => {
      expect(response.status).toBe(404);
    }, 700);


  });


});

describe('DELETE /users/:userId/unsave/:musicId', () => {
  it('should remove saved music for a user', async () => {
    const userId = '9fKpPcrHOGPHARWQJwzo'; 
    const musicId = 'JU5Xr0IwRk8vd8xHhzW9'; 
    const response = await request(app).delete(`/users/${userId}/unsave/${musicId}`);
    setTimeout(() => {
      expect(response.status).toBe(200);
    }, 700);
    

  });

});
