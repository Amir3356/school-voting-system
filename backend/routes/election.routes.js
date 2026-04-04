import express from 'express';
import {
  createElection,
  getAllElections,
  getElectionById,
  updateElection,
  updateElectionStatus,
  deleteElection
} from '../controllers/election.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/role.middleware.js';

const router = express.Router();

router.get('/', authenticate, getAllElections);
router.get('/:id', authenticate, getElectionById);
router.post('/', authenticate, isAdmin, createElection);
router.put('/:id', authenticate, isAdmin, updateElection);
router.patch('/:id/status', authenticate, isAdmin, updateElectionStatus);
router.delete('/:id', authenticate, isAdmin, deleteElection);

export default router;
