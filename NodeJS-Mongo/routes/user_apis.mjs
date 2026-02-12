/**
 * User API endpoints for managing users
 */

import express from 'express';
import UserController from '../controllers/user_controller.mjs';

const router = express.Router();

/**
 * Create a new user
 * POST /users
 */
router.post('/users', async (req, res) => {
    const { data, statusCode } = await UserController.createUser(req.body);
    res.status(statusCode).json(data);
});

/**
 * Get user by ID
 * GET /users/:user_id
 */
router.get('/users/:user_id', async (req, res) => {
    const { data, statusCode } = await UserController.getUser(req.params.user_id);
    res.status(statusCode).json(data);
});

/**
 * Get user by email
 * GET /users/email/:email
 */
router.get('/users/email/:email', async (req, res) => {
    const { data, statusCode } = await UserController.getUserByEmail(req.params.email);
    res.status(statusCode).json(data);
});

/**
 * Get all users with pagination
 * GET /users?limit=50&skip=0
 */
router.get('/users', async (req, res) => {
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;
    const { data, statusCode } = await UserController.getAllUsers(limit, skip);
    res.status(statusCode).json(data);
});

/**
 * Change user password
 * PUT /users/:user_id/change-password
 */
router.put('/users/:user_id/change-password', async (req, res) => {
    const { data, statusCode } = await UserController.changePassword(req.params.user_id, req.body);
    res.status(statusCode).json(data);
});

/**
 * Health check endpoint for user APIs
 * GET /users/health
 */
router.get('/users/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        service: 'user_apis',
        endpoints: [
            'POST /users - Create user',
            'GET /users - Get all users (with pagination)',
            'GET /users/{user_id} - Get user by ID',
            'GET /users/email/{email} - Get user by email',
            'PUT /users/{user_id}/change-password - Change user password'
        ]
    });
});

export default router;
