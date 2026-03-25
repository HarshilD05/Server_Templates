# Ollama Embedder (NodeJS)

A lightweight, local caching and proxy server built with **NodeJS** and **Express** that exposes an underlying [Ollama](https://ollama.com/) instance to easily generate vector embeddings.

## Features
- **Auto-Initialization**: Checks if Ollama is installed on your system upon boot. If not running, it automatically spawns an `ollama serve` process in the background.
- **Auto-Downloading**: Reads from `config/req_models.txt` and automatically pulls required models (e.g., `"nomic-embed-text"`) if they are missing locally.
- **Batch Embedding**: Supports bulk embedding generation by accepting an array of texts.
- **Throttling/Limits**: Hard-capped at 100 texts per request to protect memory usage.

## Prerequisites
- [Ollama](https://ollama.com/) installed on the host machine.
- NodeJS (v14+ recommended)

## Setup & Installation

1. Navigate to the server directory:
   ```bash
   cd Ollama-NodeJS
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```

## Running the Server

Start the Node application:
```bash
npm start
```
or
```bash
node app.mjs
```

The server will automatically configure your Ollama environment and start listening on `http://localhost:3000`. Logs from the background Ollama process will be appended to `ollama.log` in the parent directory.

## Documentation
Please refer to the [API Documentation Overview](docs/API_DOCS/main.md) and [Embedding APIs](docs/API_DOCS/EMBED_APIS.md) for detailed endpoints and routing documentation, or import the [Postman collection](postman_apis/Ollama_Embedder.postman_collection.json).
