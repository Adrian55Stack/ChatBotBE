const query = "Who killed Jormungandr?";

const embed = async (text: string) => {
  const res = await fetch("http://localhost:11434/api/embeddings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "nomic-embed-text",
      prompt: text,
    }),
  });

  return (await res.json()).embedding;
};

const qdrant = new (await import("@qdrant/js-client-rest")).QdrantClient({
  url: "http://localhost:6333",
});

const vector = await embed(query);

const result = await qdrant.search("mythology", {
  vector,
  limit: 3,
});

console.log(result.map(r => r.payload));