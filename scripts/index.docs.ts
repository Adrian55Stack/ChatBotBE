// scripts/index-docs.ts

import fs from 'fs';
import path from 'path';
import { COLLECTION, qdrant } from '../src/config/qdrant';
import { embeddingsAPI, embeddingsModel } from '../src/config/ollama';

export async function embed(text: string): Promise<number[]> {
  const res = await fetch(embeddingsAPI, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: embeddingsModel,
      prompt: text
    })
  });

  const data = await res.json();
  return data.embedding;
}

async function indexFile(
  filePath: string,
  id: number
): Promise<void> {
  const text = fs.readFileSync(filePath, 'utf8');

  const vector = await embed(text);

  const mythology = path.basename(path.dirname(filePath));
  const title = path.basename(filePath, '.md');

  await qdrant.upsert(COLLECTION, {
    wait: true,
    points: [
      {
        id,
        vector,
        payload: {
          title,
          mythology,
          text,
          source: filePath
        }
      }
    ]
  });

  console.log(`Indexed: ${filePath}`);
}

async function walk(dir: string): Promise<string[]> {
  const entries = fs.readdirSync(dir, {
    withFileTypes: true
  });

  let files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files = files.concat(await walk(fullPath));
    } else if (entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

async function main() {
  const files = await walk('./mythology');

  let id = 1;

  for (const file of files) {
    await indexFile(file, id++);
  }

  console.log(`Done. Indexed ${files.length} files.`);
}

main().catch(console.error);