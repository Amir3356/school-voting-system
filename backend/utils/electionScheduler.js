import cron from 'node-cron';
import pool from '../config/db.js';

// Check and update election status every minute
const scheduleElectionStatusUpdates = () => {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      const now = new Date();
      
      // Auto-open elections that have reached their start time
      await pool.query(
        `UPDATE elections 
         SET status = 'open' 
         WHERE status = 'closed' 
         AND start_time IS NOT NULL 
         AND start_time <= ? 
         AND (end_time IS NULL OR end_time > ?)`,
        [now, now]
      );

      // Auto-close elections that have reached their end time
      await pool.query(
        `UPDATE elections 
         SET status = 'closed' 
         WHERE status = 'open' 
         AND end_time IS NOT NULL 
         AND end_time <= ?`,
        [now]
      );

      // Log status changes (optional - comment out in production)
      const [openedElections] = await pool.query(
        `SELECT id, title FROM elections 
         WHERE status = 'open' 
         AND start_time IS NOT NULL 
         AND start_time <= ? 
         AND start_time > DATE_SUB(?, INTERVAL 1 MINUTE)`,
        [now, now]
      );

      const [closedElections] = await pool.query(
        `SELECT id, title FROM elections 
         WHERE status = 'closed' 
         AND end_time IS NOT NULL 
         AND end_time <= ? 
         AND end_time > DATE_SUB(?, INTERVAL 1 MINUTE)`,
        [now, now]
      );

      if (openedElections.length > 0) {
        console.log('🗳️  Auto-opened elections:', openedElections.map(e => e.title).join(', '));
      }

      if (closedElections.length > 0) {
        console.log('🔒 Auto-closed elections:', closedElections.map(e => e.title).join(', '));
      }

    } catch (error) {
      console.error('❌ Election scheduler error:', error.message);
    }
  });

  console.log('⏰ Election scheduler started - checking every minute');
};

// Check election status on demand
export const checkElectionStatus = async (electionId) => {
  try {
    const now = new Date();
    
    const [elections] = await pool.query(
      'SELECT * FROM elections WHERE id = ?',
      [electionId]
    );

    if (elections.length === 0) {
      return null;
    }

    const election = elections[0];
    let shouldUpdate = false;
    let newStatus = election.status;

    // Check if should be open
    if (election.status === 'closed' && 
        election.start_time && 
        new Date(election.start_time) <= now &&
        (!election.end_time || new Date(election.end_time) > now)) {
      newStatus = 'open';
      shouldUpdate = true;
    }

    // Check if should be closed
    if (election.status === 'open' && 
        election.end_time && 
        new Date(election.end_time) <= now) {
      newStatus = 'closed';
      shouldUpdate = true;
    }

    // Update if needed
    if (shouldUpdate) {
      await pool.query(
        'UPDATE elections SET status = ? WHERE id = ?',
        [newStatus, electionId]
      );
      election.status = newStatus;
    }

    return election;
  } catch (error) {
    console.error('Error checking election status:', error);
    return null;
  }
};

export default scheduleElectionStatusUpdates;
