# Vector Store Setup

This guide covers first-time setup of the local vector store used for semantic document search.
The stack uses **Ollama** for generating embeddings locally and **Qdrant** as the vector database.

---

## Prerequisites

- [Docker](https://www.docker.com/) installed and running
- [Ollama](https://ollama.com/) installed
- Node.js v18+

---

## Step 1 — Start Qdrant

Pull and run the Qdrant Docker image:

```bash
docker pull qdrant/qdrant
docker run -p 6333:6333 qdrant/qdrant
```

Qdrant will be available at `http://localhost:6333`.
You can verify it is running by opening `http://localhost:6333/dashboard` in your browser.

> To persist data between container restarts, mount a volume:
> ```bash
> docker run -p 6333:6333 -v $(pwd)/qdrant_storage:/qdrant/storage qdrant/qdrant
> ```

---

## Step 2 — Pull the Embedding Model

Pull the embedding model via Ollama:

```bash
ollama pull nomic-embed-text
```

Verify Ollama is running and the model is available:

```bash
ollama list
```

You should see `nomic-embed-text` in the list.

---

## Step 3 — Install Dependencies

```bash
npm install
```

---

## Step 4 — Create the Collection

This creates the Qdrant collection with the correct vector size and distance metric.
Only needs to be run once.

```bash
npm run create-collection-docs
```

Expected output:
```
Collection created
```

If you run it again:
```
Collection already exists
```

---

## Step 5 — Index Documents

Place your `.md` files inside the `mythology/` folder following this structure:

```
mythology/
├── norse/
│   ├── odin.md
│   └── thor.md
├── greek/
│   └── zeus.md
└── egyptian/
    └── osiris.md
```

Then run:

```bash
npm run index-docs
```

Expected output:
```
Indexed: mythology/norse/odin.md
Indexed: mythology/norse/thor.md
...
Done. Indexed 27 files.
```

Each file is read, converted to a vector embedding via Ollama, and stored in Qdrant with the following metadata:

| Field | Description |
|---|---|
| `title` | Filename without extension |
| `mythology` | Parent folder name (e.g. `norse`, `greek`) |
| `text` | Full file content |
| `source` | Relative file path |

---

## Step 6 — Test Search

Run a semantic search query against the indexed documents:

```bash
npm run search-test
```

The query is defined in `scripts/search-test.ts`. Edit it to test different questions:

```typescript
const query = "Who killed Jormungandr?";
```

---

## Full Initialization Checklist

```
☐ Docker running
☐ docker run -p 6333:6333 qdrant/qdrant
☐ ollama pull nomic-embed-text
☐ npm install
☐ npm run create-collection-docs
☐ npm run index-docs
☐ npm run search-test
```

---

## Configuration

Ollama and Qdrant settings are defined in:

- `src/config/ollama.ts` — embedding API URL and model name
- `src/config/qdrant.ts` — Qdrant client, collection name, and host