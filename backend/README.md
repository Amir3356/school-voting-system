# School Voting System - Backend

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Setup MySQL Database (XAMPP)
1. Start XAMPP and run MySQL
2. Open phpMyAdmin (http://localhost/phpmyadmin)
3. Import the database schema:
   - Open `config/database.sql`
   - Copy and execute the SQL commands in phpMyAdmin

### 3. Configure Environment
Edit `.env` file and update database credentials if needed:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=school_voting
JWT_SECRET=your_jwt_secret_key_change_this_in_production
```

### 4. Run the Server
```bash
npm run dev
```

Server will run on http://localhost:5000

## Default Admin Credentials
- Username: admin
- Password: admin123

## API Endpoints

### Auth
- POST /api/auth/register - Register new student
- POST /api/auth/login - Login

### Elections (Protected)
- GET /api/elections - Get all elections
- GET /api/elections/:id - Get election by ID
- POST /api/elections - Create election (Admin only)
- PATCH /api/elections/:id/status - Update election status (Admin only)
- DELETE /api/elections/:id - Delete election (Admin only)

### Candidates (Protected)
- GET /api/candidates/election/:electionId - Get candidates by election
- POST /api/candidates - Create candidate (Admin only)
- PUT /api/candidates/:id - Update candidate (Admin only)
- DELETE /api/candidates/:id - Delete candidate (Admin only)

### Votes (Protected)
- POST /api/votes - Cast vote
- GET /api/votes/status/:electionId - Check if user voted
- GET /api/votes/results/:electionId - Get election results

### Users (Protected, Admin only)
- GET /api/users - Get all users
- DELETE /api/users/:id - Delete user
