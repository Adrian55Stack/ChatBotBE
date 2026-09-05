import { translateAPI, translateAPIMethod } from "../config/translate.js";

export async function translateString(question, target_lang) {
  const response = await fetch(translateAPI, {
    method: translateAPIMethod,
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