import pool from '../config/db.js';

export const createCandidate = async (req, res) => {
  try {
    const { name, position, election_id } = req.body;
    const photo = req.file ? `/uploads/candidates/${req.file.filename}` : null;

    const [result] = await pool.query(
      'INSERT INTO candidates (name, position, photo, election_id) VALUES (?, ?, ?, ?)',
      [name, position, photo, election_id]
    );

    res.status(201).json({ 
      message: 'Candidate created', 
      candidateId: result.insertId,
      photo: photo
    });
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
    const { name, position } = req.body;
    const { id } = req.params;
    const photo = req.file ? `/uploads/candidates/${req.file.filename}` : undefined;

    let query = 'UPDATE candidates SET name = ?, position = ?';
    let params = [name, position];

    if (photo) {
      query += ', photo = ?';
      params.push(photo);
    }

    query += ' WHERE id = ?';
    params.push(id);

    await pool.query(query, params);

    res.json({ message: 'Candidate updated', photo: photo });
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
