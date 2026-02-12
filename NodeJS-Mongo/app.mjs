/**
 * Main Express Application
 * Node.JS/Express MongoDB Base Server with User Management
 */

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectToMongoDB, closeMongoDBConnection } from './config/mongodb.mjs';
import mainRouter from './routes/main_router.mjs';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Server configuration
const PORT = process.env.SERVER_PORT || 5000;
const HOST = '0.0.0.0'; // Make accessible on local network
let server;

/**
 * Initialize MongoDB connection
 */
async function initializeMongoDB() {
    try {
        await connectToMongoDB();
        console.log('[App] MongoDB connection initialized successfully');
    } catch (error) {
        console.error('[App] Failed to initialize MongoDB:', error);
        // You can choose to exit here or continue without MongoDB
        // process.exit(1);
    }
}

/**
 * Cleanup function to close MongoDB connection on app shutdown
 */
async function cleanup(signal) {
    console.log(`\n[App] Received ${signal} signal, starting graceful shutdown...`);
    
    try {
        // Close server first to stop accepting new connections
        if (server) {
            await new Promise((resolve) => {
                server.close(() => {
                    console.log('[App] HTTP server closed');
                    resolve();
                });
            });
        }

        // Close MongoDB connection
        await closeMongoDBConnection();
        console.log('[App] MongoDB connection closed');
        
        console.log('[App] Cleanup completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('[App] Error during cleanup:', error);
        process.exit(1);
    }
}

/**
 * Setup signal handlers for graceful shutdown
 */
function setupSignalHandlers() {
    // Handle SIGTERM (termination signal)
    process.on('SIGTERM', () => cleanup('SIGTERM'));
    
    // Handle SIGINT (Ctrl+C)
    process.on('SIGINT', () => cleanup('SIGINT'));
    
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
        console.error('[App] Uncaught Exception:', error);
        cleanup('UNCAUGHT_EXCEPTION');
    });
    
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
        console.error('[App] Unhandled Rejection at:', promise, 'reason:', reason);
        cleanup('UNHANDLED_REJECTION');
    });
}

/**
 * Root endpoint
 */
app.get('/', (req, res) => {
    res.json({
        message: 'Hello, this is a Node.JS/Express app hosted on local WiFi!',
        version: '1.0.0',
        status: 'running'
    });
});

/**
 * Health check endpoint
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'nodejs-mongo-base-server',
        timestamp: new Date().toISOString()
    });
});

// Register API routes
app.use('/api', mainRouter);

/**
 * 404 handler
 */
app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.method} ${req.url} not found`
    });
});

/**
 * Error handler
 */
app.use((err, req, res, next) => {
    console.error('[App] Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

/**
 * Start the server
 */
async function startServer() {
    try {
        // Initialize MongoDB
        await initializeMongoDB();
        
        // Setup signal handlers for graceful shutdown
        setupSignalHandlers();
        
        // Start HTTP server
        server = app.listen(PORT, HOST, () => {
            console.log(`[App] Server is running on http://${HOST}:${PORT}`);
            console.log(`[App] Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log('[App] Press Ctrl+C to stop the server');
        });
    } catch (error) {
        console.error('[App] Failed to start server:', error);
        process.exit(1);
    }
}

// Start the server
startServer();

export default app;
