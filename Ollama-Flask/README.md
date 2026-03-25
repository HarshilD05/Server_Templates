# Ollama Embedder (Flask)

A lightweight, local caching and proxy server built with **Python 3** and **Flask** that exposes an underlying [Ollama](https://ollama.com/) instance to easily generate vector embeddings.

## Features
- **Auto-Initialization**: Checks if Ollama is installed on your system upon boot. If not running, it automatically spawns an `ollama serve` process in the background.
- **Auto-Downloading**: Reads from `config/req_models.txt` and automatically pulls required models (e.g., `"nomic-embed-text"`) if they are missing locally.
- **Batch Embedding**: Supports bulk embedding generation by accepting an array of texts.
- **Throttling/Limits**: Hard-capped at 100 texts per request to protect memory usage.

## Prerequisites
- [Ollama](https://ollama.com/) installed on the host machine.
- Python 3.8+ 

## Setup & Installation

1. Navigate to the server directory:
   ```bash
   cd Ollama-Flask
   ```
2. Create an isolated virtual environment (optional but recommended):
   ```bash
   python -m venv .venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. Install the dependencies:
   ```bash
   python -m pip install -r requirements.txt
   ```

## Running the Server

Start the Flask application:
```bash
python app.py
```

The server will automatically configure your Ollama environment and start listening on `http://0.0.0.0:3000`. Logs from the background Ollama process will be appended to `ollama.log` in the parent directory.

## Documentation
Please refer to the [API Documentation Overview](docs/API_DOCS/main.md) and [Embedding APIs](docs/API_DOCS/EMBED_APIS.md) for detailed endpoints and routing documentation, or import the [Postman collection](postman_apis/Ollama_Embedder.postman_collection.json).
