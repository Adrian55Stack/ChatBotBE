import { translateString } from "../utils/translateString.js";

export async function translateMiddleware(req, res, next) {
  try {
    const [translatedQuestion, detected_language] = await translateString(req.body.question, 'EN');
    req.body.question = translatedQuestion;
    req.body.detected_language = detected_language;
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Translation failed" });
  }
}