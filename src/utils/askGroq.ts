import { groqAPI, groqModel, systemPrompt } from "../config/groq.ts";

export async function askGroq(context: string, question: string) {
  const res = await fetch(groqAPI, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: groqModel,
      messages: [
        {
          role: "system",
          content:
            systemPrompt,
        },
        {
          role: "user",
          content: `Context:\n${context}\n\nQuestion:\n${question}`,
        },
      ],
    }),
  });

  const data = await res.json();
  return data.choices[0].message.content;
}
