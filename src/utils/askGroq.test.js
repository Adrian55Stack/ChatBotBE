// askGroq.test.js
import { askGroq } from '../utils/askGroq.js';

jest.mock('../config/groq.js', () => ({
  groqAPI: 'http://mock-groq/api/chat',
  groqModel: 'mock-model',
  systemPrompt: 'You are a mythology assistant.',
}));

describe('askGroq', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    global.fetch = jest.fn();
    process.env = { ...originalEnv, GROQ_API_KEY: 'mock-api-key' };
  });

  afterEach(() => {
    jest.resetAllMocks();
    process.env = originalEnv;
  });

  it('calls fetch with the correct URL, headers, and body', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        choices: [{ message: { content: 'Zeus is the king of the gods.' } }],
      }),
    });

    await askGroq('Some context about Zeus.', 'Who is Zeus?');

    expect(global.fetch).toHaveBeenCalledWith('http://mock-groq/api/chat', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer mock-api-key',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mock-model',
        messages: [
          {
            role: 'system',
            content: 'You are a mythology assistant.',
          },
          {
            role: 'user',
            content:
              'Context:\nSome context about Zeus.\n\nQuestion:\nWho is Zeus?',
          },
        ],
      }),
    });
  });

  it('returns the message content from the response', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({
        choices: [{ message: { content: 'Hades rules the underworld.' } }],
      }),
    });

    const result = await askGroq('Context about Hades.', 'Who is Hades?');

    expect(result).toBe('Hades rules the underworld.');
  });

  it('propagates errors when fetch fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(
      askGroq('Context.', 'Who is Poseidon?')
    ).rejects.toThrow('Network error');
  });

  it('throws if the response has no choices array', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({}),
    });

    await expect(
      askGroq('Context.', 'Who is Athena?')
    ).rejects.toThrow();
  });
});