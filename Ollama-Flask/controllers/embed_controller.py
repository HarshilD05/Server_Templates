from flask import request, jsonify
import urllib.request
import urllib.error
import json

def generate_embeddings():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "Invalid JSON payload"}), 400

        texts = data.get("texts")
        model = data.get("model", "nomic-embed-text")

        if not texts or not isinstance(texts, list):
            return jsonify({"error": "Please provide an array of strings in the \"texts\" field."}), 400

        if len(texts) > 100:
            return jsonify({"error": "Exceeded maximum limit of 100 texts per request."}), 400

        if len(texts) == 0:
            return jsonify({"error": "The texts array cannot be empty."}), 400

        req_data = json.dumps({
            "model": model,
            "input": texts
        }).encode("utf-8")

        req = urllib.request.Request(
            "http://127.0.0.1:11434/api/embed",
            data=req_data,
            headers={"Content-Type": "application/json"},
            method="POST"
        )

        try:
            with urllib.request.urlopen(req) as response:
                response_body = response.read().decode("utf-8")
                response_json = json.loads(response_body)

                return jsonify({
                    "success": True,
                    "model": response_json.get("model"),
                    "embeddings": response_json.get("embeddings")
                }), 200
        except urllib.error.HTTPError as e:
            error_data = e.read().decode("utf-8")
            return jsonify({"error": f"Ollama API error: {error_data}"}), 500
        except urllib.error.URLError as e:
            return jsonify({"error": f"Failed to connect to Ollama API: {e.reason}"}), 500

    except Exception as e:
        print(f"Embedding Generation Error: {e}")
        return jsonify({"error": "Internal Server Error while generating embeddings."}), 500
