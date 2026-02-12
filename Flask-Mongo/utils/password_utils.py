"""
Password utility functions for secure password hashing and verification
"""

import bcrypt
import logging

logger = logging.getLogger(__name__)


class PasswordUtils:
    """Utility class for password operations using bcrypt"""
    
    @staticmethod
    def hash_password(password: str) -> str:
        """
        Hash a password using bcrypt (includes automatic salt generation)
        
        Args:
            password: Plain text password
            
        Returns:
            Hashed password as string (includes salt)
        """
        try:
            # Generate salt and hash password
            # bcrypt automatically generates a salt and includes it in the hash
            password_bytes = password.encode('utf-8')
            salt = bcrypt.gensalt()
            hashed = bcrypt.hashpw(password_bytes, salt)
            
            # Return as string for storage
            return hashed.decode('utf-8')
            
        except Exception as e:
            logger.error(f"[PasswordUtils] Error hashing password: {e}")
            raise
    
    @staticmethod
    def verify_password(password: str, password_hash: str) -> bool:
        """
        Verify a password against its hash
        
        Args:
            password: Plain text password to verify
            password_hash: Stored hashed password
            
        Returns:
            True if password matches, False otherwise
        """
        try:
            password_bytes = password.encode('utf-8')
            hash_bytes = password_hash.encode('utf-8')
            
            return bcrypt.checkpw(password_bytes, hash_bytes)
            
        except Exception as e:
            logger.error(f"[PasswordUtils] Error verifying password: {e}")
            return False
    
    @staticmethod
    def validate_password_strength(password: str) -> tuple[bool, str]:
        """
        Validate password strength
        
        Args:
            password: Plain text password to validate
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        if len(password) < 8:
            return False, "Password must be at least 8 characters long"
        
        if not any(char.isupper() for char in password):
            return False, "Password must contain at least one uppercase letter"
        
        if not any(char.islower() for char in password):
            return False, "Password must contain at least one lowercase letter"
        
        if not any(char.isdigit() for char in password):
            return False, "Password must contain at least one digit"
        
        # Check for special characters
        special_chars = "!@#$%^&*()_+-=[]{}|;:,.<>?"
        if not any(char in special_chars for char in password):
            return False, "Password must contain at least one special character"
        
        return True, "Password is valid"


# Default export
__all__ = ['PasswordUtils']
