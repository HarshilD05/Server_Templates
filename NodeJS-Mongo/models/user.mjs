/**
 * User Model using Mongoose
 */

import mongoose from 'mongoose';
import PasswordUtils from '../utils/password_utils.mjs';

/**
 * User type enumeration
 */
export const UserType = {
    ADMIN: 'ADMIN',
    USER: 'USER'
};

/**
 * User Schema Definition
 */
const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email address']
        },
        user_type: {
            type: String,
            required: [true, 'User type is required'],
            enum: {
                values: Object.values(UserType),
                message: '{VALUE} is not a valid user type'
            }
        },
        password_salt: {
            type: String,
            default: null,
            select: false  // Don't include in queries by default
        },
        password_hash: {
            type: String,
            default: null,
            select: false  // Don't include in queries by default
        }
    },
    {
        timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
        collection: 'users'
    }
);

/**
 * Transform _id to id in JSON responses
 */
userSchema.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password_salt;
        delete ret.password_hash;
        return ret;
    }
});

/**
 * Static Methods
 */

/**
 * Create a new user
 * @param {string} email - User email address
 * @param {string} user_type - User type (ADMIN, USER)
 * @param {string|null} password - Plain text password (optional)
 * @returns {Promise<string|null>} User ID as string if successful, null if failed
 */
userSchema.statics.createUser = async function(email, user_type, password = null) {
    try {
        let password_salt = null;
        let password_hash = null;

        // Hash password if provided
        if (password) {
            const { salt, hash } = PasswordUtils.createPasswordHash(password);
            password_salt = salt;
            password_hash = hash;
        }

        const user = new this({
            email,
            user_type,
            password_salt,
            password_hash
        });

        const savedUser = await user.save();
        const userId = savedUser._id.toString();
        console.log(`[User] Created new user ${userId}`);
        return userId;
    } catch (error) {
        console.error('[User] Error creating user:', error);
        return null;
    }
};

/**
 * Get user by ID
 * @param {string} userId - User ObjectId as string
 * @returns {Promise<Object|null>} User document or null
 */
userSchema.statics.getUserById = async function(userId) {
    try {
        const user = await this.findById(userId).lean();
        if (user) {
            user._id = user._id.toString();
        }
        return user;
    } catch (error) {
        console.error('[User] Error getting user:', error);
        return null;
    }
};

/**
 * Get user by email
 * @param {string} email - User email address
 * @returns {Promise<Object|null>} User document or null
 */
userSchema.statics.getUserByEmail = async function(email) {
    try {
        const user = await this.findOne({ email }).lean();
        if (user) {
            user._id = user._id.toString();
        }
        return user;
    } catch (error) {
        console.error('[User] Error getting user by email:', error);
        return null;
    }
};

/**
 * Get all users with pagination
 * @param {number} limit - Maximum number of users to return
 * @param {number} skip - Number of users to skip
 * @returns {Promise<Array>} List of user documents
 */
userSchema.statics.getAllUsers = async function(limit = 50, skip = 0) {
    try {
        limit = Math.min(limit, 100);

        const users = await this.find()
            .skip(skip)
            .limit(limit)
            .lean();

        users.forEach(user => {
            user._id = user._id.toString();
            if (user.created_at) {
                user.created_at = user.created_at.toISOString();
            }
            if (user.updated_at) {
                user.updated_at = user.updated_at.toISOString();
            }
        });

        console.log(`[User] Retrieved ${users.length} users (limit: ${limit}, skip: ${skip})`);
        return users;
    } catch (error) {
        console.error('[User] Error getting all users:', error);
        return [];
    }
};

/**
 * Verify a user's password
 * @param {string} userId - User ObjectId as string
 * @param {string} password - Plain text password to verify
 * @returns {Promise<boolean>} True if password matches, false otherwise
 */
userSchema.statics.verifyUserPassword = async function(userId, password) {
    try {
        const user = await this.findById(userId).select('+password_salt +password_hash').lean();
        if (!user || !user.password_salt || !user.password_hash) {
            console.warn(`[User] User ${userId} not found or has no password`);
            return false;
        }

        return PasswordUtils.verifyPassword(password, user.password_salt, user.password_hash);
    } catch (error) {
        console.error('[User] Error verifying password:', error);
        return false;
    }
};

/**
 * Update a user's password
 * @param {string} userId - User ObjectId as string
 * @param {string} newPassword - New plain text password
 * @returns {Promise<boolean>} True if successful, false if failed
 */
userSchema.statics.updateUserPassword = async function(userId, newPassword) {
    try {
        const { salt, hash } = PasswordUtils.createPasswordHash(newPassword);

        const result = await this.findByIdAndUpdate(
            userId,
            {
                $set: {
                    password_salt: salt,
                    password_hash: hash
                }
            },
            { new: false }
        );

        if (result) {
            console.log(`[User] Updated password for user ${userId}`);
            return true;
        } else {
            console.warn(`[User] No user found with ID ${userId}`);
            return false;
        }
    } catch (error) {
        console.error('[User] Error updating password:', error);
        return false;
    }
};

/**
 * Create and export User model
 */
const User = mongoose.model('User', userSchema);

export default User;
