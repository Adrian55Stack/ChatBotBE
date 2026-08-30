import request from 'supertest';
import app from '../../server.js';

describe('POST /api/chat', () => {
    it('should return a valid response', async () => {
        const godName = 'Odin';
        const res = await request(app)
            .post('/api/chat')
            .send({ question: `Provide details about ${godName}` });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('answer');
        expect(res.body.answer.includes(godName)).toBe(true);
    }, 10000);

    it('should return 500 on error', async () => {
        const res = await request(app)
            .post('/api/chat')
            .send({});

        expect(res.status).toBe(500);
    });
});