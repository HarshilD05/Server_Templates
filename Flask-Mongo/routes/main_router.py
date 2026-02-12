from flask import Blueprint
from routes.user_apis import user_apis

main_router = Blueprint('main_router', __name__)

# Register blueprints without URL prefixes (routes defined in individual files)
main_router.register_blueprint(user_apis)