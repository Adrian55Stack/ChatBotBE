import { QdrantClient } from "@qdrant/js-client-rest";

const qdrant = new QdrantClient({
  url: "http://localhost:6333",
});

async function ensureCollection() {
  const collections = await qdrant.getCollections();

  const exists = collections.collections.some(
    (c) => c.name === "mythology"
  );

  if (exists) {
    console.log("Collection already exists");
    return;
  }

  await qdrant.createCollection("mythology", {
    vectors: {
      size: 768, // IMPORTANT: must match Ollama embedding model
      distance: "Cosine",
    },
  });

  console.log("Collection created");
}

ensureCollection();