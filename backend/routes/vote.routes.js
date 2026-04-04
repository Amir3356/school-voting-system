import express from 'express';
import { castVote, checkVoteStatus, getResults } from '../controllers/vote.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authenticate, castVote);
router.get('/status/:electionId', authenticate, checkVoteStatus);
router.get('/results/:electionId', authenticate, getResults);

export default router;
