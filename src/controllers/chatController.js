import { searchMythology } from '../utils/searchMythology.js';
import { askGroq } from '../utils/askGroq.js';
import { translateString } from '../utils/translateString.js';

export const sendMessage = async (req, res) => {
  try {
    const question = req.body.question;

    const context = await searchMythology(question);

    const answer = await askGroq(context, question);

    const [translatedAnswer] = await translateString(answer, req.body.detected_language);

    res.json({
      question,
      answer: translatedAnswer,
      contextUsed: context,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chat failed" });
  }
};
