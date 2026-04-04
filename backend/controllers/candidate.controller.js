import pool from '../config/db.js';

export const createCandidate = async (req, res) => {
  try {
    const { name, position, photo, election_id } = req.body;

    const [result] = await pool.query(
      'INSERT INTO candidates (name, position, photo, election_id) VALUES (?, ?, ?, ?)',
      [name, position, photo || null, election_id]
    );

    res.status(201).json({ message: 'Candidate created', candidateId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getCandidatesByElection = async (req, res) => {
  try {
    const [candidates] = await pool.query(
      'SELECT * FROM candidates WHERE election_id = ?',
      [req.params.electionId]
    );

    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateCandidate = async (req, res) => {
  try {
    const { name, position, photo } = req.body;
    const { id } = req.params;

    await pool.query(
      'UPDATE candidates SET name = ?, position = ?, photo = ? WHERE id = ?',
      [name, position, photo, id]
    );

    res.json({ message: 'Candidate updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteCandidate = async (req, res) => {
  try {
    await pool.query('DELETE FROM candidates WHERE id = ?', [req.params.id]);
    res.json({ message: 'Candidate deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
