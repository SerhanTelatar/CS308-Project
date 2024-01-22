const request = require('supertest');
const express = require('express');
const admin = require('firebase-admin');
const approvalRouter = require('../router/approve');

// Mock Firebase Firestore for testing
jest.mock('firebase-admin', () => ({
  firestore: () => ({
    collection: jest.fn(() => ({
      doc: jest.fn(() => ({
        get: jest.fn(() => Promise.resolve({
          exists: true,
          data: () => ({ isApproved: false }), 
        })),
        update: jest.fn(),
      })),
    })),
  }),
}));

const app = express();
app.use(express.json());
app.use('/approve', approvalRouter);

describe('Approval Route', () => {
  

  it('should approve a user successfully', async () => {
    // Mock Firestore data for an unapproved user
    admin.firestore().collection().doc().get.mockResolvedValue({
      exists: true,
      data: () => ({ isApproved: false }),
    });

    const response = await request(app).get('/approve/53j4LXQvuL2jX9AseNLz');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ success: true, message: 'User approved successfully' });
  });

  it('should handle user not found', async () => {
    // Mock Firestore data for a non-existent user
    admin.firestore().collection().doc().get.mockResolvedValue({
      exists: false
    });
  
    const response = await request(app).get('/approve/123dfg');
    setTimeout(() => {
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ success: false, message: 'User not found' });
    }, 1000);
  });

  it('should handle already approved user', async () => {
    // Mock Firestore data for an already approved user
    admin.firestore().collection().doc().get.mockResolvedValue({
      exists: true,
      data: () => ({ isApproved: true }),
    });

    const response = await request(app).get('/approve/53j4LXQvuL2jX9AseNLz');

    setTimeout(() => {
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ success: false, message: 'User is already approved' });
    }, 1000);
    
  });

  it('should handle approval failure', async () => {

    const response = await request(app).get('/approve/4u293VuMShfkXXyVntTJ');
    setTimeout(() => {
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ success: false, message: 'Approval failed: Firestore error' });
    }, 1000);
    
  });
});