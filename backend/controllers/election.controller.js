import pool from '../config/db.js';

export const createElection = async (req, res) => {
  try {
    const { title, description, start_time, end_time } = req.body;

    const [result] = await pool.query(
      'INSERT INTO elections (title, description, status, start_time, end_time) VALUES (?, ?, ?, ?, ?)',
      [title, description, 'closed', start_time || null, end_time || null]
    );

    res.status(201).json({ message: 'Election created', electionId: result.insertId });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getAllElections = async (req, res) => {
  try {
    const [elections] = await pool.query('SELECT * FROM elections ORDER BY created_at DESC');
    res.json(elections);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getElectionById = async (req, res) => {
  try {
    const [elections] = await pool.query('SELECT * FROM elections WHERE id = ?', [req.params.id]);
    
    if (elections.length === 0) {
      return res.status(404).json({ message: 'Election not found' });
    }

    res.json(elections[0]);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateElection = async (req, res) => {
  try {
    const { title, description, status, start_time, end_time } = req.body;
    const { id } = req.params;

    await pool.query(
      'UPDATE elections SET title = ?, description = ?, status = ?, start_time = ?, end_time = ? WHERE id = ?',
      [title, description, status, start_time || null, end_time || null, id]
    );

    res.json({ message: 'Election updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateElectionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    await pool.query('UPDATE elections SET status = ? WHERE id = ?', [status, id]);

    res.json({ message: 'Election status updated' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteElection = async (req, res) => {
  try {
    await pool.query('DELETE FROM elections WHERE id = ?', [req.params.id]);
    res.json({ message: 'Election deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
