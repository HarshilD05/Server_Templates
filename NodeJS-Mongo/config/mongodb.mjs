/**
 * MongoDB Configuration Module
 * Manages MongoDB connection using Mongoose
 */

import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// MongoDB Configuration
const MONGODB_URL = process.env.MONGODB_URL?.trim() || '';
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD?.trim() || '';
const MONGODB_DATABASE = process.env.MONGODB_DATABASE?.trim() || '';

// Validate MongoDB URL
if (!MONGODB_URL) {
    throw new Error("[MongoDB] Environment variable 'MONGODB_URL' is missing or empty. Please set MONGODB_URL in your .env file.");
}

// Handle password encoding for Atlas URLs (mongodb+srv://username:<password>@...)
let connectionUrl = MONGODB_URL;
if (MONGODB_URL.includes('<password>')) {
    if (!MONGODB_PASSWORD) {
        throw new Error("[MongoDB] MONGODB_URL contains '<password>' placeholder but MONGODB_PASSWORD is not set. Please set MONGODB_PASSWORD in your .env file.");
    }
    // URL encode the password to handle special characters
    const encodedPassword = encodeURIComponent(MONGODB_PASSWORD);
    connectionUrl = MONGODB_URL.replace('<password>', encodedPassword);
    console.log('[MongoDB] Password placeholder replaced with encoded password');
}

// Validate MongoDB Database
if (!MONGODB_DATABASE) {
    throw new Error("[MongoDB] Environment variable 'MONGODB_DATABASE' is missing or empty. Please set MONGODB_DATABASE in your .env file.");
}

console.log('[MongoDB] Configuration loaded successfully');

/**
 * Establish connection to MongoDB using Mongoose
 */
export async function connectToMongoDB() {
    try {
        // Configure mongoose
        mongoose.set('strictQuery', false);

        // Connect to MongoDB
        await mongoose.connect(connectionUrl, {
            dbName: MONGODB_DATABASE,
            retryWrites: true,
            w: 'majority'
        });

        console.log('[MongoDB] Successfully connected to MongoDB!');
        console.log(`[MongoDB] Using database: ${MONGODB_DATABASE}`);

        // Setup connection event handlers
        mongoose.connection.on('error', (error) => {
            console.error('[MongoDB] Connection error:', error);
        });

        mongoose.connection.on('disconnected', () => {
            console.warn('[MongoDB] Disconnected from MongoDB');
        });

        mongoose.connection.on('reconnected', () => {
            console.log('[MongoDB] Reconnected to MongoDB');
        });

        return mongoose.connection;
    } catch (error) {
        console.error('[MongoDB] Failed to connect to MongoDB:', error);
        throw error;
    }
}

/**
 * Test MongoDB connection
 */
export async function testConnection() {
    try {
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.db.admin().ping();
            return { success: true, message: 'MongoDB connection is healthy' };
        } else {
            return { success: false, message: 'MongoDB not connected' };
        }
    } catch (error) {
        return { success: false, message: error.message };
    }
}

/**
 * Close MongoDB connection
 */
export async function closeMongoDBConnection() {
    try {
        await mongoose.connection.close();
        console.log('[MongoDB] Connection closed');
    } catch (error) {
        console.error('[MongoDB] Error closing connection:', error);
        throw error;
    }
}

/**
 * Get MongoDB connection instance
 */
export function getMongooseConnection() {
    return mongoose.connection;
}

/**
 * Get Mongoose instance
 */
export function getMongoose() {
    return mongoose;
}

/**
 * Ensure MongoDB connection is established
 */
export async function ensureMongoDBConnection() {
    try {
        if (mongoose.connection.readyState !== 1) {
            await connectToMongoDB();
        }
        
        const result = await testConnection();
        if (result.success) {
            console.log(`[MongoDB] Connection verified: ${result.message}`);
        } else {
            console.error(`[MongoDB] Connection failed: ${result.message}`);
            throw new Error(result.message);
        }
    } catch (error) {
        console.error('[MongoDB] Error ensuring connection:', error);
        throw error;
    }
}

export default mongoose;
