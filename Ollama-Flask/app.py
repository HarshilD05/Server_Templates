from flask import Flask
from config.ollama import init_ollama
from routes.embed_routes import embed_bp

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 50 * 1024 * 1024  # 50MB

app.register_blueprint(embed_bp, url_prefix="/api")

if __name__ == "__main__":
    init_ollama()
    app.run(host="0.0.0.0", port=3000)
