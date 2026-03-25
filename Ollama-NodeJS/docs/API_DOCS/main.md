# API Documentation Overview

Welcome to the Ollama Embedder (NodeJS) API docs.

## Base URL
All endpoints branch off standard local bindings:
`http://localhost:3000/api`

## HTTP Status Codes
The API adheres to standard HTTP Response codes:
- **200 OK**: Request completed successfully.
- **400 Bad Request**: Invalid JSON body, missing parameters, or length limits exceeded.
- **500 Internal Server Error**: Communication error with the underlying Ollama instance or unknown server faults.

## Standard Error Response Format
When a request fails, the API responds with a standard error object in JSON format:
```json
{
  "error": "Detailed error message describing the issue."
}
```

## Available Resources
- [Embedding APIs](./EMBED_APIS.md) - Endpoints relating to generating embeddings.
