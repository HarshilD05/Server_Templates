/**
 * Password utility functions for secure password hashing and verification
 * Uses Node.js crypto module with PBKDF2
 */

import crypto from 'node:crypto';

/**
 * Password utility class
 */
class PasswordUtils {
    /**
     * Generate a random salt
     * 
     * @param {number} length - Length of salt in bytes (default: 32)
     * @returns {string} Hexadecimal salt string
     */
    static generateSalt(length = 32) {
        return crypto.randomBytes(length).toString('hex');
    }

    /**
     * Hash a password with a given salt using PBKDF2
     * 
     * @param {string} password - Plain text password
     * @param {string} salt - Salt string (hexadecimal)
     * @returns {string} Hashed password as hexadecimal string
     */
    static hashPassword(password, salt) {
        try {
            // Use PBKDF2 with 100,000 iterations, SHA-512
            const hash = crypto.pbkdf2Sync(
                password,
                salt,
                10000,  // iterations
                64,      // key length in bytes
                'sha512' // digest algorithm
            );
            
            return hash.toString('hex');
        } catch (error) {
            console.error('[PasswordUtils] Error hashing password:', error);
            throw error;
        }
    }

    /**
     * Create password hash and salt for a new password
     * 
     * @param {string} password - Plain text password
     * @returns {Object} Object containing salt and hash { salt, hash }
     */
    static createPasswordHash(password) {
        const salt = this.generateSalt();
        const hash = this.hashPassword(password, salt);
        return { salt, hash };
    }

    /**
     * Verify a password against stored salt and hash
     * 
     * @param {string} password - Plain text password to verify
     * @param {string} storedSalt - Stored salt from database
     * @param {string} storedHash - Stored hash from database
     * @returns {boolean} True if password matches, false otherwise
     */
    static verifyPassword(password, storedSalt, storedHash) {
        try {
            if (!password || !storedSalt || !storedHash) {
                console.error('[PasswordUtils] Missing password, salt, or hash');
                return false;
            }

            // Hash the provided password with the stored salt
            const hash = this.hashPassword(password, storedSalt);
            
            // Compare the hashes using timing-safe comparison
            return crypto.timingSafeEqual(
                Buffer.from(hash, 'hex'),
                Buffer.from(storedHash, 'hex')
            );
        } catch (error) {
            console.error('[PasswordUtils] Error verifying password:', error);
            return false;
        }
    }

    /**
     * Validate password strength
     * 
     * @param {string} password - Plain text password to validate
     * @returns {Object} Object containing isValid and message { isValid, message }
     */
    static validatePasswordStrength(password) {
        if (!password) {
            return { isValid: false, message: 'Password is required' };
        }

        if (password.length < 8) {
            return { isValid: false, message: 'Password must be at least 8 characters long' };
        }

        if (!/[A-Z]/.test(password)) {
            return { isValid: false, message: 'Password must contain at least one uppercase letter' };
        }

        if (!/[a-z]/.test(password)) {
            return { isValid: false, message: 'Password must contain at least one lowercase letter' };
        }

        if (!/[0-9]/.test(password)) {
            return { isValid: false, message: 'Password must contain at least one digit' };
        }

        const specialChars = /[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/;
        if (!specialChars.test(password)) {
            return { isValid: false, message: 'Password must contain at least one special character' };
        }

        return { isValid: true, message: 'Password is valid' };
    }
}

export default PasswordUtils;