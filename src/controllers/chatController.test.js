// sendMessage.test.js
import { sendMessage } from '../controllers/chatController.js';
import { searchMythology } from '../utils/searchMythology.js';
import { askGroq } from '../utils/askGroq.js';
import { translateString } from '../utils/translateString.js';

jest.mock('../utils/searchMythology.js', () => ({
  searchMythology: jest.fn(),
}));

jest.mock('../utils/askGroq.js', () => ({
  askGroq: jest.fn(),
}));

jest.mock('../utils/translateString.js', () => ({
  translateString: jest.fn(),
}));

describe('sendMessage', () => {
  let req, res, consoleErrorSpy;

  beforeEach(() => {
    req = { body: { question: 'Who is Zeus?' } };
    res = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('returns question, answer, and contextUsed on success', async () => {
    searchMythology.mockResolvedValueOnce('Zeus is the king of the gods.');
    askGroq.mockResolvedValueOnce('Zeus rules Mount Olympus.');
    translateString.mockResolvedValueOnce(['Zeus rules Mount Olympus.', 'EN']);

    await sendMessage(req, res);

    expect(searchMythology).toHaveBeenCalledWith('Who is Zeus?');
    expect(askGroq).toHaveBeenCalledWith(
      'Zeus is the king of the gods.',
      'Who is Zeus?'
    );
    expect(res.json).toHaveBeenCalledWith({
      question: 'Who is Zeus?',
      answer: 'Zeus rules Mount Olympus.',
      contextUsed: 'Zeus is the king of the gods.',
    });
    expect(res.status).not.toHaveBeenCalled();
  });

  it('returns 500 and error message when searchMythology fails', async () => {
    searchMythology.mockRejectedValueOnce(new Error('Qdrant unavailable'));

    await sendMessage(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Chat failed' });
    expect(askGroq).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('returns 500 and error message when askGroq fails', async () => {
    searchMythology.mockResolvedValueOnce('Some context.');
    askGroq.mockRejectedValueOnce(new Error('Groq API failed'));

    await sendMessage(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Chat failed' });
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('handles a missing question in the request body', async () => {
    req.body = {};
    searchMythology.mockResolvedValueOnce('');
    askGroq.mockResolvedValueOnce('I need a question to answer.');
    translateString.mockResolvedValueOnce(['I need a question to answer.', 'EN'])

    await sendMessage(req, res);

    expect(searchMythology).toHaveBeenCalledWith(undefined);
    expect(res.json).toHaveBeenCalledWith({
      question: undefined,
      answer: 'I need a question to answer.',
      contextUsed: '',
    });
  });
});