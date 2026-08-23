import { embeddingsAPI, embeddingsModel } from "../src/config/ollama";
import { COLLECTION, qdrant } from "../src/config/qdrant";

const query = "Who killed Jormungandr?";

const embed = async (text: string) => {
  const res = await fetch(embeddingsAPI, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: embeddingsModel,
      prompt: text,
    }),
  });

  return (await res.json()).embedding;
};

const vector = await embed(query);

const result = await qdrant.search(COLLECTION, {
  vector,
  limit: 3,
});

console.log(result.map(r => r.payload));