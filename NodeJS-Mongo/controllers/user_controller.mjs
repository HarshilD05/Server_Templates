/**
 * User Controller for handling user-related business logic
 */

import User from '../models/user.mjs';
import PasswordUtils from '../utils/password_utils.mjs';

/**
 * User Controller class
 */
class UserController {
    /**
     * Create a new user
     * 
     * @param {Object} data - Request data containing user information
     * @returns {Promise<Object>} Response object with data and status code
     */
    static async createUser(data) {
        try {
            if (!data || Object.keys(data).length === 0) {
                return { data: { error: 'No data provided' }, statusCode: 400 };
            }

            // Validate required fields
            if (!data.email || !data.user_type) {
                return { data: { error: 'email and user_type are required' }, statusCode: 400 };
            }

            // Validate password strength if provided
            const password = data.password;
            if (password) {
                const { isValid, message } = PasswordUtils.validatePasswordStrength(password);
                if (!isValid) {
                    return { data: { error: message }, statusCode: 400 };
                }
            }

            // Check if user already exists
            const existingUser = await User.getUserByEmail(data.email);
            if (existingUser) {
                return { data: { error: 'User with this email already exists' }, statusCode: 409 };
            }

            // Create user (with password if provided)
            const userId = await User.createUser(data.email, data.user_type, password);

            if (userId) {
                const responseData = {
                    message: 'User created successfully',
                    user_id: userId,
                    email: data.email,
                    user_type: data.user_type
                };
                if (password) {
                    responseData.has_password = true;
                }

                return { data: responseData, statusCode: 201 };
            } else {
                return { data: { error: 'Failed to create user' }, statusCode: 500 };
            }
        } catch (error) {
            console.error('[UserController] Error creating user:', error);
            return { data: { error: 'Internal server error' }, statusCode: 500 };
        }
    }

    /**
     * Get user by ID
     * 
     * @param {string} userId - User ID
     * @returns {Promise<Object>} Response object with data and status code
     */
    static async getUser(userId) {
        try {
            const user = await User.getUserById(userId);

            if (user) {
                // Remove password fields from response for security
                delete user.password_hash;
                delete user.password_salt;

                return {
                    data: {
                        message: 'User retrieved successfully',
                        user
                    },
                    statusCode: 200
                };
            } else {
                return { data: { error: 'User not found' }, statusCode: 404 };
            }
        } catch (error) {
            console.error('[UserController] Error getting user:', error);
            return { data: { error: 'Internal server error' }, statusCode: 500 };
        }
    }

    /**
     * Get user by email
     * 
     * @param {string} email - User email address
     * @returns {Promise<Object>} Response object with data and status code
     */
    static async getUserByEmail(email) {
        try {
            const user = await User.getUserByEmail(email);

            if (user) {
                // Remove password fields from response for security
                delete user.password_hash;
                delete user.password_salt;

                return {
                    data: {
                        message: 'User retrieved successfully',
                        user
                    },
                    statusCode: 200
                };
            } else {
                return { data: { error: 'User not found' }, statusCode: 404 };
            }
        } catch (error) {
            console.error('[UserController] Error getting user by email:', error);
            return { data: { error: 'Internal server error' }, statusCode: 500 };
        }
    }

    /**
     * Get all users with pagination
     * 
     * @param {number} limit - Maximum number of users to return
     * @param {number} skip - Number of users to skip for pagination
     * @returns {Promise<Object>} Response object with data and status code
     */
    static async getAllUsers(limit = 50, skip = 0) {
        try {
            // Enforce maximum limit
            limit = Math.min(limit, 100);

            // Get all users
            const users = await User.getAllUsers(limit, skip);

            // Remove password fields from response for security
            users.forEach(user => {
                delete user.password_hash;
                delete user.password_salt;
            });

            return {
                data: {
                    message: 'Users retrieved successfully',
                    users,
                    count: users.length,
                    limit,
                    skip
                },
                statusCode: 200
            };
        } catch (error) {
            console.error('[UserController] Error getting all users:', error);
            return { data: { error: 'Internal server error' }, statusCode: 500 };
        }
    }

    /**
     * Change a user's password
     * 
     * @param {string} userId - User ID
     * @param {Object} data - Request data containing old_password and new_password
     * @returns {Promise<Object>} Response object with data and status code
     */
    static async changePassword(userId, data) {
        try {
            if (!data || Object.keys(data).length === 0) {
                return { data: { error: 'No data provided' }, statusCode: 400 };
            }

            // Validate required fields
            if (!data.old_password || !data.new_password) {
                return { data: { error: 'old_password and new_password are required' }, statusCode: 400 };
            }

            // Check if user exists
            const user = await User.getUserById(userId);
            if (!user) {
                return { data: { error: 'User not found' }, statusCode: 404 };
            }

            // Check if user has a password set
            if (!user.password_hash) {
                return { data: { error: 'User does not have a password set' }, statusCode: 400 };
            }

            // Verify old password
            const isValidOldPassword = await User.verifyUserPassword(userId, data.old_password);
            if (!isValidOldPassword) {
                return { data: { error: 'Invalid old password' }, statusCode: 401 };
            }

            // Validate new password strength
            const { isValid, message } = PasswordUtils.validatePasswordStrength(data.new_password);
            if (!isValid) {
                return { data: { error: message }, statusCode: 400 };
            }

            // Check new password is different from old
            if (data.old_password === data.new_password) {
                return { data: { error: 'New password must be different from old password' }, statusCode: 400 };
            }

            // Update password
            const success = await User.updateUserPassword(userId, data.new_password);

            if (success) {
                return {
                    data: {
                        message: 'Password changed successfully',
                        user_id: userId
                    },
                    statusCode: 200
                };
            } else {
                return { data: { error: 'Failed to change password' }, statusCode: 500 };
            }
        } catch (error) {
            console.error('[UserController] Error changing password:', error);
            return { data: { error: 'Internal server error' }, statusCode: 500 };
        }
    }
}

export {
    UserController
};

export default UserController;
