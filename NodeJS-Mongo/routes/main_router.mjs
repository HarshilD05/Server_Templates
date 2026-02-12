/**
 * Main router for registering all API routes
 */

import express from 'express';
import userApis from './user_apis.mjs';

const router = express.Router();

// Register user APIs
router.use(userApis);

export default router;
