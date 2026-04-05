import pool from '../config/db.js';

export const getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, username, email, role, status, created_at FROM users ORDER BY created_at DESC'
    );

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Prevent changing admin status
    const [user] = await pool.query('SELECT role FROM users WHERE id = ?', [id]);
    
    if (user.length > 0 && user[0].role === 'admin') {
      return res.status(403).json({ message: 'Cannot change admin user status' });
    }

    // Validate status
    if (!['active', 'inactive'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be active or inactive' });
    }

    await pool.query('UPDATE users SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'User status updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent deleting admin
    const [user] = await pool.query('SELECT role FROM users WHERE id = ?', [id]);
    
    if (user.length > 0 && user[0].role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin user' });
    }

    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getStudentStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get total elections
    const [totalElections] = await pool.query('SELECT COUNT(*) as count FROM elections');
    
    // Get elections voted in
    const [votedElections] = await pool.query(
      'SELECT COUNT(DISTINCT election_id) as count FROM votes WHERE user_id = ?',
      [userId]
    );
    
    // Get active elections
    const now = new Date();
    const [activeElections] = await pool.query(
      `SELECT COUNT(*) as count FROM elections 
       WHERE status = 'open' 
       AND (start_time IS NULL OR start_time <= ?) 
       AND (end_time IS NULL OR end_time > ?)`,
      [now, now]
    );
    
    // Get upcoming elections
    const [upcomingElections] = await pool.query(
      `SELECT COUNT(*) as count FROM elections 
       WHERE start_time IS NOT NULL AND start_time > ?`,
      [now]
    );
    
    // Get recent votes with election and candidate details
    const [recentVotes] = await pool.query(
      `SELECT v.voted_at, e.title as election_title, c.name as candidate_name, c.position
       FROM votes v
       JOIN elections e ON v.election_id = e.id
       JOIN candidates c ON v.candidate_id = c.id
       WHERE v.user_id = ?
       ORDER BY v.voted_at DESC
       LIMIT 5`,
      [userId]
    );

    res.json({
      totalElections: totalElections[0].count,
      votedElections: votedElections[0].count,
      activeElections: activeElections[0].count,
      upcomingElections: upcomingElections[0].count,
      pendingVotes: totalElections[0].count - votedElections[0].count,
      participationRate: totalElections[0].count > 0 
        ? ((votedElections[0].count / totalElections[0].count) * 100).toFixed(1)
        : 0,
      recentVotes
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
