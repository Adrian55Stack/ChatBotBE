import { embeddingsAPI, embeddingsModel } from "../config/ollama.ts";

export async function embed(text: string) {
  const res = await fetch(embeddingsAPI, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: embeddingsModel,
      prompt: text,
    }),
  });

  const data = await res.json();
  return data.embedding;
}