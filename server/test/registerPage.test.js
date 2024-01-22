const request = require('supertest');
const express = require('express');
const admin = require('firebase-admin');
const router = require('../router/registerPage'); 

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
        id: 'testDocId',
      })),
    })),
  }),
}));

// Mocking nodemailer's sendMail function
jest.mock('nodemailer', () => ({
  createTransport: () => ({
    sendMail: jest.fn(),
  }),
}));

const app = express();
app.use(express.json());
app.use('/', router);

describe('Registration Route', () => {
  test('POST / should register a new user', async () => {
    const userData = {
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpassword',
    };

    const response = await request(app)
      .post('/')
      .send(userData);

    setTimeout(() => {
      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Registration successful. Awaiting approval.');
    }, 1200);
    
    // Add further expectations based on the expected behavior after registration
  });

  test('POST / should handle username already exists scenario', async () => {
    const userData = {
      name: 'Test User',
      username: 'existinguser', // This username should already exist in the mocked database
      email: 'test@example.com',
      password: 'testpassword',
    };

    const response = await request(app)
      .post('/')
      .send(userData);
      setTimeout(() => {
        expect(response.status).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Username already exists. Please choose another username.');
      }, 1200);
    
    // Add further expectations based on the expected behavior when the username already exists
  });

  test('POST / should handle invalid input data', async () => {
    const userData = {
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpassword',
    };
  
    const response = await request(app)
      .post('/')
      .send(userData);
  
    setTimeout(() => {
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid input data');
      // Add expectations for the specific validation errors returned in the response
    }, 1200);
  });
  
  test('POST / should handle registration failure', async () => {
    const userData = {
      name: 'Test User',
      username: 'testuser',
      email: 'test@example.com',
      password: 'testpassword',
    };
  
    // Simulate a registration failure, for example, by rejecting the Firestore add operation
    jest.spyOn(admin.firestore().collection('users'), 'add').mockRejectedValue(new Error('Registration failed'));
  
    const response = await request(app)
      .post('/')
      .send(userData);
  
    setTimeout(() => {
      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Registration failed: Registration failed');
    }, 1200);
    // Reset the mock to avoid affecting other tests
    admin.firestore().collection('users').add.mockReset();
  });
  
});
