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

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Registration successful. Awaiting approval.');
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

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('Username already exists. Please choose another username.');
    // Add further expectations based on the expected behavior when the username already exists
  });
});
