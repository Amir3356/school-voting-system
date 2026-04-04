import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pool from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import electionRoutes from './routes/election.routes.js';
import candidateRoutes from './routes/candidate.routes.js';
import voteRoutes from './routes/vote.routes.js';
import userRoutes from './routes/user.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/elections', electionRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/votes', voteRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Test MySQL connection
const testDatabaseConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ MySQL Database Connected Successfully!');
    console.log(`📊 Database: ${process.env.DB_NAME}`);
    console.log(`🔗 Host: ${process.env.DB_HOST}`);
    connection.release();
  } catch (error) {
    console.error('❌ MySQL Connection Failed:', error.message);
    console.error('💡 Make sure MySQL is running in XAMPP');
    console.error('💡 Check your .env database credentials');
  }
};

// Start server
app.listen(PORT, async () => {
  console.log('\n🚀 ================================');
  console.log('🎉 School Voting System Backend');
  console.log('🚀 ================================\n');
  console.log('✅ Express.js Server Started Successfully!');
  console.log(`🌐 Server running on: http://localhost:${PORT}`);
  console.log(`📡 API Base URL: http://localhost:${PORT}/api`);
  console.log(`🏥 Health Check: http://localhost:${PORT}/api/health\n`);
  
  // Test database connection
  await testDatabaseConnection();
  
  console.log('\n✨ Server is ready to accept requests!');
  console.log('📝 Press Ctrl+C to stop the server\n');
});
