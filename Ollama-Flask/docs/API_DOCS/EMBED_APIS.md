# Embeddings API

## Generate Embeddings
**Endpoint:** `POST /embed`

Generates vector embeddings for a given array of texts using the underlying local Ollama service.

### Request Body (JSON)
- `texts` (Array of Strings, Required): The inputs to encode. Minimum 1 item, maximum 100 items per request.
- `model` (String, Optional): The embedding model to use. Defaults to `"nomic-embed-text"`.

### Constraints
- **Max rate:** The array provided in `texts` cannot exceed 100 items.

### Example Request
```json
{
  "model": "nomic-embed-text",
  "texts": [
    "Hello world!",
    "How are you doing today?"
  ]
}
```

### Example Response
```json
{
  "success": true,
  "model": "nomic-embed-text",
  "embeddings": [
    [0.123, -0.456, 0.789, ...],
    [-0.987, 0.654, -0.321, ...]
  ]
}
```
