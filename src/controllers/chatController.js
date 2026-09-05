import {searchMythology} from '../utils/searchMythology.js';
import {askGroq} from '../utils/askGroq.js';

export const sendMessage = async (req, res) => {
    try {
    const [question, detected_language] = await translateString(req.body.question, 'EN');

    const context = await searchMythology(question);

    const answer = await askGroq(context, question);

    const [translatedAnswer] = await translateString(answer, detected_language);

    res.json({
      question,
      translatedAnswer,
      contextUsed: context,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Chat failed" });
  }
};

async function translateString(question, target_lang) {
  const response = await fetch("https://api-free.deepl.com/v2/translate", {
    method: "POST",
    headers: {
      "Authorization": `DeepL-Auth-Key ${process.env.DEEP_L_API_kEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text: [question], target_lang }),
  });

  const resp = await response.text();
  const responseJSON = JSON.parse(resp);
  const responseData = responseJSON.translations[0];
  return [responseData.text, responseData.detected_source_language];
}

