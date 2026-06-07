import { QdrantClient } from "@qdrant/js-client-rest";

export const COLLECTION = "mythology";

export const qdrant = new QdrantClient({
  url: "http://localhost:6333",
});