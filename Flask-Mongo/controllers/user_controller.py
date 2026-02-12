"""
User Controller for handling user-related business logic
"""

from typing import Tuple, Dict, Any
from pydantic import ValidationError
from models import UserModel
from utils import UserUtils, PasswordUtils
import logging

logger = logging.getLogger(__name__)


class UserController:
    """Controller class for user operations"""
    
    @staticmethod
    def create_user(data: Dict[str, Any]) -> Tuple[Dict[str, Any], int]:
        """
        Create a new user
        
        Args:
            data: Dictionary containing user data (email, user_type, password - optional)
            
        Returns:
            Tuple of (response_dict, status_code)
        """
        try:
            if not data:
                return {'error': 'No data provided'}, 400
            
            # Validate required fields
            if 'email' not in data or 'user_type' not in data:
                return {'error': 'email and user_type are required'}, 400
            
            # Validate password strength if provided
            password = data.get('password')
            if password:
                is_valid, message = PasswordUtils.validate_password_strength(password)
                if not is_valid:
                    return {'error': message}, 400
            
            # Validate data using Pydantic model
            try:
                user_model = UserModel(
                    email=data['email'],
                    user_type=data['user_type'],
                    chats=[]
                )
            except ValidationError as e:
                return {'error': 'Validation error', 'details': e.errors()}, 400
            
            # Check if user already exists
            existing_user = UserUtils.get_user_by_email(data['email'])
            if existing_user:
                return {'error': 'User with this email already exists'}, 409
            
            # Create user (with password if provided)
            user_id = UserUtils.create_user(data['email'], data['user_type'], password)
            
            if user_id:
                response_data = {
                    'message': 'User created successfully',
                    'user_id': user_id,
                    'email': data['email'],
                    'user_type': data['user_type']
                }
                if password:
                    response_data['has_password'] = True
                
                return response_data, 201
            else:
                return {'error': 'Failed to create user'}, 500
                
        except Exception as e:
            logger.error(f"[UserController] Error creating user: {e}")
            return {'error': 'Internal server error'}, 500
    
    @staticmethod
    def get_user(user_id: str) -> Tuple[Dict[str, Any], int]:
        """
        Get user by ID
        
        Args:
            user_id: User ID
            
        Returns:
            Tuple of (response_dict, status_code)
        """
        try:
            user = UserUtils.get_user(user_id)
            
            if user:
                # Remove password_hash from response for security
                user.pop('password_hash', None)
                
                return {
                    'message': 'User retrieved successfully',
                    'user': user
                }, 200
            else:
                return {'error': 'User not found'}, 404
                
        except Exception as e:
            logger.error(f"[UserController] Error getting user: {e}")
            return {'error': 'Internal server error'}, 500
    
    @staticmethod
    def get_user_chats(user_id: str, limit: int = 50, skip: int = 0) -> Tuple[Dict[str, Any], int]:
        """
        Get all chats for a user
        
        Args:
            user_id: User ID
            limit: Maximum number of chats to return
            skip: Number of chats to skip for pagination
            
        Returns:
            Tuple of (response_dict, status_code)
        """
        try:
            # Validate user exists
            user = UserUtils.get_user(user_id)
            if not user:
                return {'error': 'User not found'}, 404
            
            # Enforce maximum limit
            limit = min(limit, 100)
            
            from utils import ChatUtils
            chats = ChatUtils.get_user_chats(user_id, limit, skip)
            
            return {
                'message': 'User chats retrieved successfully',
                'user_id': user_id,
                'chats': chats,
                'count': len(chats),
                'limit': limit,
                'skip': skip
            }, 200
            
        except Exception as e:
            logger.error(f"[UserController] Error getting user chats: {e}")
            return {'error': 'Internal server error'}, 500
    
    @staticmethod
    def get_user_by_email(email: str) -> Tuple[Dict[str, Any], int]:
        """
        Get user by email
        
        Args:
            email: User email address
            
        Returns:
            Tuple of (response_dict, status_code)
        """
        try:
            user = UserUtils.get_user_by_email(email)
            
            if user:
                # Remove password_hash from response for security
                user.pop('password_hash', None)
                
                return {
                    'message': 'User retrieved successfully',
                    'user': user
                }, 200
            else:
                return {'error': 'User not found'}, 404
                
        except Exception as e:
            logger.error(f"[UserController] Error getting user by email: {e}")
            return {'error': 'Internal server error'}, 500
    
    @staticmethod
    def get_all_users(limit: int = 50, skip: int = 0) -> Tuple[Dict[str, Any], int]:
        """
        Get all users with pagination
        
        Args:
            limit: Maximum number of users to return
            skip: Number of users to skip for pagination
            
        Returns:
            Tuple of (response_dict, status_code)
        """
        try:
            # Enforce maximum limit
            limit = min(limit, 100)
            
            # Get all users
            users = UserUtils.get_all_users(limit, skip)
            
            # Remove password_hash from response for security
            for user in users:
                user.pop('password_hash', None)
            
            return {
                'message': 'Users retrieved successfully',
                'users': users,
                'count': len(users),
                'limit': limit,
                'skip': skip
            }, 200
            
        except ValueError as e:
            return {'error': 'Invalid pagination parameters'}, 400
        except Exception as e:
            logger.error(f"[UserController] Error getting all users: {e}")
            return {'error': 'Internal server error'}, 500
    
    @staticmethod
    def change_password(user_id: str, data: Dict[str, Any]) -> Tuple[Dict[str, Any], int]:
        """
        Change a user's password
        
        Args:
            user_id: User ID
            data: Dictionary containing old_password and new_password
            
        Returns:
            Tuple of (response_dict, status_code)
        """
        try:
            if not data:
                return {'error': 'No data provided'}, 400
            
            # Validate required fields
            if 'old_password' not in data or 'new_password' not in data:
                return {'error': 'old_password and new_password are required'}, 400
            
            # Check if user exists
            user = UserUtils.get_user(user_id)
            if not user:
                return {'error': 'User not found'}, 404
            
            # Check if user has a password set
            if not user.get('password_hash'):
                return {'error': 'User does not have a password set'}, 400
            
            # Verify old password
            if not UserUtils.verify_user_password(user_id, data['old_password']):
                return {'error': 'Invalid old password'}, 401
            
            # Validate new password strength
            is_valid, message = PasswordUtils.validate_password_strength(data['new_password'])
            if not is_valid:
                return {'error': message}, 400
            
            # Check new password is different from old
            if data['old_password'] == data['new_password']:
                return {'error': 'New password must be different from old password'}, 400
            
            # Update password
            success = UserUtils.update_user_password(user_id, data['new_password'])
            
            if success:
                return {
                    'message': 'Password changed successfully',
                    'user_id': user_id
                }, 200
            else:
                return {'error': 'Failed to change password'}, 500
                
        except Exception as e:
            logger.error(f"[UserController] Error changing password: {e}")
            return {'error': 'Internal server error'}, 500
