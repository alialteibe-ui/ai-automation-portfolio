# RAG Retrieval Pipeline

This document shows the architecture I am currently building toward for LLM applications that must answer from approved business knowledge instead of guessing.

## Flow

```text
Documents / FAQs / Product Data
        |
        v
Clean + Chunk Text
        |
        v
Create Embeddings
        |
        v
Store in PostgreSQL + pgvector
        |
User Question
        |
        v
Embed Question
        |
        v
Similarity Search
        |
        v
Top Relevant Chunks
        |
        v
LLM Prompt with Retrieved Context
        |
        v
Answer + Source References
```

## Important production rules

- Do not let the model answer business facts without retrieved context when the product requires grounded answers.
- Keep chunks small enough for retrieval quality, but large enough to preserve meaning.
- Store metadata such as source document, section, product, language, and updated timestamp.
- Apply access control before retrieval when users have different permissions.
- Evaluate retrieval quality separately from generation quality.
- Log low-confidence or no-result cases for human review.
- Treat retrieved text as data, not trusted instructions, to reduce prompt-injection risk.

## Example PostgreSQL shape

```sql
create table knowledge_chunks (
  id bigint generated always as identity primary key,
  source text not null,
  content text not null,
  metadata jsonb not null default '{}'::jsonb,
  embedding vector(1536),
  created_at timestamptz not null default now()
);
```

The exact embedding dimension depends on the chosen embedding model.

## Learning status

RAG and vector search are part of my current development roadmap. This public example documents the architecture and engineering concepts I am learning and applying next; it is intentionally not presented as a completed production deployment.
