// embed.test.js
import { embed } from '../utils/embed.js';

jest.mock('../config/ollama.js', () => ({
  embeddingsAPI: 'http://mock-ollama/api/embeddings',
  embeddingsModel: 'mock-model',
}));

describe('embed', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('calls fetch with the correct URL, method, and body', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ embedding: [0.1, 0.2, 0.3] }),
    });

    await embed('Who is Zeus?');

    expect(global.fetch).toHaveBeenCalledWith(
      'http://mock-ollama/api/embeddings',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'mock-model',
          prompt: 'Who is Zeus?',
        }),
      }
    );
  });

  it('returns the embedding array from the response', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({ embedding: [0.4, 0.5, 0.6] }),
    });

    const result = await embed('Who is Hades?');

    expect(result).toEqual([0.4, 0.5, 0.6]);
  });

  it('propagates errors when fetch fails', async () => {
    global.fetch.mockRejectedValueOnce(new Error('Network error'));

    await expect(embed('Who is Poseidon?')).rejects.toThrow('Network error');
  });

  it('returns undefined if response has no embedding field', async () => {
    global.fetch.mockResolvedValueOnce({
      json: async () => ({}),
    });

    const result = await embed('Who is Athena?');

    expect(result).toBeUndefined();
  });
});