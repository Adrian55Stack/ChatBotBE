import request from 'supertest';

// const mockCreate = jest.fn().mockResolvedValue({
//     choices: [{ message: { content: 'Mocked response' } }]
// });

// jest.unstable_mockModule('groq-sdk', () => ({
//     default: jest.fn().mockImplementation(() => ({
//         chat: {
//             completions: {
//                 create: mockCreate
//             }
//         }
//     }))
// }));

let app;

beforeAll(async () => {
    jest.resetModules();
    const module = await import('../../server.js');
    app = module.default;
});

describe('Chat Routes', () => {
    it('POST /api/chat should exist and return 200', async () => {
        const res = await request(app)
            .post('/api/chat')
            .send({ message: 'Hello' });

        expect(res.status).toBe(200);
    });

    it('GET /api/chat should return 404', async () => {
        const res = await request(app).get('/api/chat');
        expect(res.status).toBe(404);
    });

    it('POST /api/unknown should return 404', async () => {
        const res = await request(app).post('/api/unknown');
        expect(res.status).toBe(404);
    });
});