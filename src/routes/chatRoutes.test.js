// chatRoutes.test.js
import request from 'supertest';
import express from 'express';
import router from '../routes/chatRoutes.js';
import { sendMessage } from '../controllers/chatController.js';

jest.mock('../controllers/chatController.js', () => ({
  sendMessage: jest.fn((req, res) => res.status(200).json({ mocked: true })),
}));

jest.mock('../utils/translateString.js', () => ({
  translateString: jest.fn((question, target_lang) =>['Who is Zeus?', 'EN'])
}));

describe('chatRoutes', () => {
  let app;

  beforeEach(() => {
    app = express();
    app.use(express.json());
    app.use('/', router);
    jest.clearAllMocks();
  });

  it('routes POST /chat to sendMessage', async () => {
    const response = await request(app)
      .post('/chat')
      .send({ question: 'Who is Zeus?' });

    expect(sendMessage).toHaveBeenCalled();
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ mocked: true });
  });

});