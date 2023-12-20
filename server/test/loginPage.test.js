const request = require('supertest');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const router = require('../router/loginPage'); 

jest.mock('../config/userDB', () => ({
  firestore: () => ({
    collection: () => ({
      where: jest.fn(),
    }),
  }),
}));

const app = express();

// Add session middleware for testing
app.use(
  session({
    secret: 'testSecret',
    resave: false,
    saveUninitialized: true,
  })
);
app.use(express.json());
app.use('/', router);

describe('Login and Logout Routes', () => {
  test('GET / should return "User is not logged in" when user is not logged in', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe('User is not logged in');
  });

  test('POST / should log in a user and return success message', async () => {
    // Mock user data and bcrypt comparison
    const mockUserData = {
      username: 'testUser',
      password: await bcrypt.hash('testPassword', 10), // Hashed password for test purposes
    };

    // Mock Firestore response for the user
    const mockFirestoreResponse = {
      empty: false,
      docs: [
        {
          data: () => mockUserData,
          id: 'mockUserId',
        },
      ],
    };

    // Mock Firestore collection and where method
    const mockCollection = jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        get: jest.fn().mockResolvedValue(mockFirestoreResponse),
      }),
    });

    // Mock Firestore and bcrypt methods
    require('../config/userDB').firestore = jest.fn().mockReturnValue({
      collection: mockCollection,
    });
    bcrypt.compare = jest.fn().mockResolvedValue(true);

    const response = await request(app)
      .post('/')
      .send({ username: 'testUser', password: 'testPassword' });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Login successful');
    expect(response.body.username).toEqual(mockUserData);
    expect(response.body.id).toBe('mockUserId');
  });

  test('GET /logout should log out a user', async () => {
    const response = await request(app).get('/logout');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Logout successful');
  });
});
