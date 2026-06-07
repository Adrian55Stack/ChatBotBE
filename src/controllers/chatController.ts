import {searchMythology} from '../utils/searchMythology.ts';
import {askGroq} from '../utils/askGroq.ts';

export const sendMessage = async (req, res) => {
    try {
    const question = req.body.question;

    const context = await searchMythology(question);

    const answer = await askGroq(context, question);

    res.json({
      question,
      answer,
      contextUsed: context,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chat failed" });
  }
};

