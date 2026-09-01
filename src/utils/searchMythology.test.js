// searchMythology.test.js
import { searchMythology } from '../utils/searchMythology.js';
import { embed } from './embed.js';
import { qdrant } from '../config/qdrant.js';

jest.mock('../config/qdrant.js', () => ({
  qdrant: {
    search: jest.fn(),
  },
  COLLECTION: 'mock-collection',
}));

jest.mock('./embed.js', () => ({
  embed: jest.fn(),
}));

describe('searchMythology', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('embeds the question and searches qdrant with the resulting vector', async () => {
    embed.mockResolvedValueOnce([0.1, 0.2, 0.3]);
    qdrant.search.mockResolvedValueOnce([]);

    await searchMythology('Who is Zeus?');

    expect(embed).toHaveBeenCalledWith('Who is Zeus?');
    expect(qdrant.search).toHaveBeenCalledWith('mock-collection', {
      vector: [0.1, 0.2, 0.3],
      limit: 3,
    });
  });

  it('joins payload texts from multiple results with double newlines', async () => {
    embed.mockResolvedValueOnce([0.1, 0.2, 0.3]);
    qdrant.search.mockResolvedValueOnce([
      { payload: { text: 'Zeus is the king of the gods.' } },
      { payload: { text: 'He rules from Mount Olympus.' } },
    ]);

    const result = await searchMythology('Who is Zeus?');

    expect(result).toBe(
      'Zeus is the king of the gods.\n\nHe rules from Mount Olympus.'
    );
  });

  it('returns an empty string when qdrant returns no results', async () => {
    embed.mockResolvedValueOnce([0.1, 0.2, 0.3]);
    qdrant.search.mockResolvedValueOnce([]);

    const result = await searchMythology('Unknown deity?');

    expect(result).toBe('');
  });

  it('handles results with missing payload or text gracefully', async () => {
    embed.mockResolvedValueOnce([0.1, 0.2, 0.3]);
    qdrant.search.mockResolvedValueOnce([
      { payload: { text: 'Valid entry.' } },
      { payload: {} },
      {},
    ]);

    const result = await searchMythology('Who is Hades?');

    expect(result).toBe('Valid entry.\n\n\n\n');
  });

  it('propagates errors when embed fails', async () => {
    embed.mockRejectedValueOnce(new Error('Embedding failed'));

    await expect(searchMythology('Who is Poseidon?')).rejects.toThrow(
      'Embedding failed'
    );
    expect(qdrant.search).not.toHaveBeenCalled();
  });

  it('propagates errors when qdrant.search fails', async () => {
    embed.mockResolvedValueOnce([0.1, 0.2, 0.3]);
    qdrant.search.mockRejectedValueOnce(new Error('Qdrant unavailable'));

    await expect(searchMythology('Who is Athena?')).rejects.toThrow(
      'Qdrant unavailable'
    );
  });
});