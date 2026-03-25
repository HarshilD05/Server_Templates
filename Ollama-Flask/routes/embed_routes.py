from flask import Blueprint
from controllers.embed_controller import generate_embeddings

embed_bp = Blueprint("embed_routes", __name__)

embed_bp.route("/embed", methods=["POST"])(generate_embeddings)
