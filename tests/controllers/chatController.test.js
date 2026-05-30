import request from 'supertest';
import app from '../../server.js';

describe('POST /api/chat', () => {
    it('should return a response', async () => {
        const res = await request(app)
            .post('/api/chat')
            .send({ message: 'Hello' });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('response');
    });

    it('should return 500 on error', async () => {
        const res = await request(app)
            .post('/api/chat')
            .send({});

        expect(res.status).toBe(500);
    });
});