import { qdrant, COLLECTION } from "../config/qdrant.js";
import {embed} from './embed.js';

export async function searchMythology(question) {
  const vector = await embed(question);

  const result = await qdrant.search(COLLECTION, {
    vector,
    limit: 3
  });

  return result.map(r => r.payload?.text).join("\n\n");
}