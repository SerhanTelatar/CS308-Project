const request = require('supertest');
const express = require('express');
const homeRouter = require('../router/homePage');

const app = express();
app.use(express.json());
app.use("/", homeRouter);

describe('Home Endpoint', () => {
  it('should respond with JSON data for the home page', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(200);


    expect(response.body).toEqual({
      success: true,
      message: 'Home page data retrieved successfully',

    });
  });

  it('should serve static files', async () => {
    const response = await request(app).get('/public/somefile.txt');  

    setTimeout(() => {
        expect(response.status).toBe(200);

      }, 600);



  });
});
