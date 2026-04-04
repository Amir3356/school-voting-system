
CREATE DATABASE IF NOT EXISTS school_voting;
USE school_voting;
CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL COMMENT 'Unique username for login',
  email VARCHAR(100) UNIQUE NOT NULL COMMENT 'User email address',
  password VARCHAR(255) NOT NULL COMMENT 'Bcrypt hashed password',
  role ENUM('admin', 'student') DEFAULT 'student' COMMENT 'User role: admin or student',
  status ENUM('active', 'inactive') DEFAULT 'active' COMMENT 'Account status: active users can login',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Account creation timestamp',
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS elections (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL COMMENT 'Election title/name',
  description TEXT COMMENT 'Election description',
  status ENUM('open', 'closed') DEFAULT 'closed' COMMENT 'Election status: open allows voting',
  start_time DATETIME COMMENT 'Scheduled start time for election',
  end_time DATETIME COMMENT 'Scheduled end time for election',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Election creation timestamp',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Last update timestamp',
  INDEX idx_status (status),
  INDEX idx_start_time (start_time),
  INDEX idx_end_time (end_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS candidates (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL COMMENT 'Candidate full name',
  position VARCHAR(100) NOT NULL COMMENT 'Position running for',
  photo VARCHAR(255) COMMENT 'Path to candidate photo (uploaded via multer)',
  election_id INT NOT NULL COMMENT 'Foreign key to elections table',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Candidate creation timestamp',
  FOREIGN KEY (election_id) REFERENCES elections(id) ON DELETE CASCADE,
  INDEX idx_election_id (election_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS votes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL COMMENT 'Foreign key to users table',
  candidate_id INT NOT NULL COMMENT 'Foreign key to candidates table',
  election_id INT NOT NULL COMMENT 'Foreign key to elections table',
  voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Vote timestamp',
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE,
  FOREIGN KEY (election_id) REFERENCES elections(id) ON DELETE CASCADE,
  UNIQUE KEY unique_vote (user_id, election_id) COMMENT 'Ensures one vote per user per election',
  INDEX idx_user_id (user_id),
  INDEX idx_candidate_id (candidate_id),
  INDEX idx_election_id (election_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

