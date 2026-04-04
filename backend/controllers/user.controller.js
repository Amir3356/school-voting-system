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
