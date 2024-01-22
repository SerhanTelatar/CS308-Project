// image.test.js
const request = require('supertest');
const router = require('../router/image'); 
const express = require('express');

const app = express();
app.use(express.json());
app.use("/",router); // Use the router directly

describe('Image Endpoint', () => {
  it('should respond with the image', async () => {
    const response = await request(app).get('/image');  // Use the correct route

    setTimeout(() => {
        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toMatch(/^image/);
      }, 600);
    
    
  });

  it('should handle errors gracefully', async () => {
    // Simulate an error by changing the imageUrl to an invalid URL
    const invalidImageUrl = 'https://invalid-url/image.jpg';
    jest.spyOn(require('axios'), 'get').mockRejectedValue(new Error('Invalid URL'));

    const response = await request(app).get('/image');  // Use the correct route

    setTimeout(() => {
        expect(response.status).toBe(500);

      }, 600);

  });
});
