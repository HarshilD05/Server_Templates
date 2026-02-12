"""
User API endpoints for managing users
"""

from flask import Blueprint, request, jsonify
from controllers.user_controller import UserController

# Create a Blueprint for user routes
user_apis = Blueprint('user_apis', __name__)


@user_apis.route('/users', methods=['POST'])
def create_user():
    """Create a new user"""
    data = request.get_json()
    result, status_code = UserController.create_user(data)
    return jsonify(result), status_code


@user_apis.route('/users/<user_id>', methods=['GET'])
def get_user(user_id):
    """Get user by ID"""
    result, status_code = UserController.get_user(user_id)
    return jsonify(result), status_code


@user_apis.route('/users/email/<email>', methods=['GET'])
def get_user_by_email(email):
    """Get user by email"""
    result, status_code = UserController.get_user_by_email(email)
    return jsonify(result), status_code


@user_apis.route('/users', methods=['GET'])
def get_all_users():
    """Get all users with pagination"""
    limit = int(request.args.get('limit', 50))
    skip = int(request.args.get('skip', 0))
    result, status_code = UserController.get_all_users(limit, skip)
    return jsonify(result), status_code


@user_apis.route('/users/<user_id>/change-password', methods=['PUT'])
def change_password(user_id):
    """Change user password"""
    data = request.get_json()
    result, status_code = UserController.change_password(user_id, data)
    return jsonify(result), status_code


@user_apis.route('/users/health', methods=['GET'])
def user_health_check():
    """Health check endpoint for user APIs"""
    return jsonify({
        'status': 'healthy',
        'service': 'user_apis',
        'endpoints': [
            'POST /users - Create user',
            'GET /users - Get all users (with pagination)',
            'GET /users/{user_id} - Get user by ID',
            'GET /users/{user_id}/chats - Get user chats',
            'GET /users/email/{email} - Get user by email',
            'PUT /users/{user_id}/change-password - Change user password'
        ]
    }), 200