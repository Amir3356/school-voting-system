import express from 'express';
import {
  createCandidate,
  getCandidatesByElection,
  updateCandidate,
  deleteCandidate
} from '../controllers/candidate.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { isAdmin } from '../middleware/role.middleware.js';

const router = express.Router();

router.get('/election/:electionId', authenticate, getCandidatesByElection);
router.post('/', authenticate, isAdmin, createCandidate);
router.put('/:id', authenticate, isAdmin, updateCandidate);
router.delete('/:id', authenticate, isAdmin, deleteCandidate);

export default router;
