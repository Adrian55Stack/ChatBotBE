import { QdrantClient } from "@qdrant/js-client-rest";

const qdrantURL = "http://localhost:6333";

export const COLLECTION = "mythology";

export const qdrant = new QdrantClient({
  url: qdrantURL
});