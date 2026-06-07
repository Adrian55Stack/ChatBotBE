import Groq from 'groq-sdk';
import { qdrant, COLLECTION } from "../config/qdrant.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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

async function searchMythology(question) {
  const vector = await embed(question);

  const result = await qdrant.search(COLLECTION, {
    vector,
    limit: 3,
  });

  return result.map(r => r.payload?.text).join("\n\n");
}

async function embed(text) {
  const res = await fetch("http://localhost:11434/api/embeddings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "nomic-embed-text",
      prompt: text,
    }),
  });

  const data = await res.json();
  return data.embedding;
}

async function askGroq(context, question) {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content:
            "You are a mythology expert. Answer ONLY using the provided context. If not found, say you don't know.",
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
