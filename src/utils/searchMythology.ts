import { qdrant, COLLECTION } from "../config/qdrant.ts";
import {embed} from '../utils/embed.ts';

export async function searchMythology(question: string) {
  const vector = await embed(question);

  const result = await qdrant.search(COLLECTION, {
    vector,
    limit: 3
  });

  return result.map(r => r.payload?.text).join("\n\n");
}