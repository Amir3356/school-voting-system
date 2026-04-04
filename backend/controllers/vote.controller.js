import pool from '../config/db.js';

export const castVote = async (req, res) => {
  try {
    const { candidate_id, election_id } = req.body;
    const user_id = req.user.id;

    // Check if election is open
    const [elections] = await pool.query(
      'SELECT status FROM elections WHERE id = ?',
      [election_id]
    );

    if (elections.length === 0 || elections[0].status !== 'open') {
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
