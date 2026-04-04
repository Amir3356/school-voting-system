import express from 'express';
import { getAllUsers, toggleUserStatus, deleteUser } from '../controllers/user.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/role.middleware.js';

const router = express.Router();

router.get('/', authenticate, isAdmin, getAllUsers);
router.patch('/:id/status', authenticate, isAdmin, toggleUserStatus);
router.delete('/:id', authenticate, isAdmin, deleteUser);

export default router;
