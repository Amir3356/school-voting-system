import pool from '../config/db.js';
import { checkElectionStatus } from '../utils/electionScheduler.js';

export const castVote = async (req, res) => {
  try {
    const { candidate_id, election_id } = req.body;
    const user_id = req.user.id;

    // Check and update election status based on time
    const election = await checkElectionStatus(election_id);

    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }

    // Check if election is open
    if (election.status !== 'open') {
      // Check if it's because of time
      const now = new Date();
      if (election.start_time && new Date(election.start_time) > now) {
        return res.status(400).json({ 
          message: `Election has not started yet. It will open on ${new Date(election.start_time).toLocaleString()}` 
        });
      }
      if (election.end_time && new Date(election.end_time) <= now) {
        return res.status(400).json({ 
          message: 'Election has ended. Voting is no longer allowed.' 
        });
      }
      return res.status(400).json({ message: 'Election is not open for voting' });
    }

    // Check if user already voted
    const [existingVote] = await pool.query(
      'SELECT * FROM votes WHERE user_id = ? AND election_id = ?',
      [user_id, election_id]
    );

    if (existingVote.length > 0) {
      return res.status(400).json({ message: 'You have already voted in this election' });
    }

    // Cast vote
    await pool.query(
      'INSERT INTO votes (user_id, candidate_id, election_id) VALUES (?, ?, ?)',
      [user_id, candidate_id, election_id]
    );

    res.status(201).json({ message: 'Vote cast successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const checkVoteStatus = async (req, res) => {
  try {
    const { electionId } = req.params;
    const user_id = req.user.id;

    const [votes] = await pool.query(
      'SELECT * FROM votes WHERE user_id = ? AND election_id = ?',
      [user_id, electionId]
    );

    res.json({ hasVoted: votes.length > 0 });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getResults = async (req, res) => {
  try {
    const { electionId } = req.params;

    const [results] = await pool.query(
      `SELECT 
        c.id,
        c.name,
        c.position,
        c.photo,
        COUNT(v.id) as vote_count
      FROM candidates c
      LEFT JOIN votes v ON c.id = v.candidate_id
      WHERE c.election_id = ?
      GROUP BY c.id
      ORDER BY vote_count DESC`,
      [electionId]
    );

    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
