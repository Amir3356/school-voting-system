# 🧪 API Testing Guide

## Base URL
```
http://localhost:8000/api
```

## Authentication
Most endpoints require Bearer token authentication:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

---

## 📝 Public Endpoints

### Register User
```http
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "student_id": "STU123",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Response:**
```json
{
  "message": "Registration successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "student_id": "STU123",
    "role": "student"
  },
  "token": "1|abc123..."
}
```

### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "admin@school.com",
  "password": "password"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@school.com",
    "role": "admin"
  },
  "token": "2|xyz789..."
}
```

---

## 🔒 Protected Endpoints

### Get Current User
```http
GET /api/me
Authorization: Bearer YOUR_TOKEN
```

### Logout
```http
POST /api/logout
Authorization: Bearer YOUR_TOKEN
```

---

## 🗳️ Election Endpoints

### Get All Elections
```http
GET /api/elections
Authorization: Bearer YOUR_TOKEN
```

### Get Active Election
```http
GET /api/elections/active
Authorization: Bearer YOUR_TOKEN
```

### Get Election by ID
```http
GET /api/elections/1
Authorization: Bearer YOUR_TOKEN
```

### Create Election (Admin Only)
```http
POST /api/elections
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "title": "Student Council Election 2024",
  "description": "Vote for your student representatives",
  "start_date": "2024-05-01 08:00:00",
  "end_date": "2024-05-07 17:00:00",
  "status": "active"
}
```

### Update Election (Admin Only)
```http
PUT /api/elections/1
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "status": "completed"
}
```

### Delete Election (Admin Only)
```http
DELETE /api/elections/1
Authorization: Bearer ADMIN_TOKEN
```

---

## 👥 Candidate Endpoints

### Get All Candidates
```http
GET /api/candidates
Authorization: Bearer YOUR_TOKEN
```

### Get Candidates by Election
```http
GET /api/candidates?election_id=1
Authorization: Bearer YOUR_TOKEN
```

### Get Candidate by ID
```http
GET /api/candidates/1
Authorization: Bearer YOUR_TOKEN
```

### Create Candidate (Admin Only)
```http
POST /api/candidates
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "name": "Jane Smith",
  "position": "President",
  "description": "Experienced leader committed to student welfare",
  "image": "https://example.com/image.jpg",
  "election_id": 1
}
```

### Update Candidate (Admin Only)
```http
PUT /api/candidates/1
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "description": "Updated description"
}
```

### Delete Candidate (Admin Only)
```http
DELETE /api/candidates/1
Authorization: Bearer ADMIN_TOKEN
```

---

## 🗳️ Voting Endpoints

### Submit Vote
```http
POST /api/vote
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
  "candidate_id": 1,
  "election_id": 1
}
```

**Response:**
```json
{
  "message": "Vote submitted successfully",
  "vote": {
    "id": 1,
    "user_id": 2,
    "candidate_id": 1,
    "election_id": 1
  }
}
```

**Error (Already Voted):**
```json
{
  "message": "You have already voted in this election"
}
```

### Check Vote Status
```http
GET /api/vote/check/1
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "has_voted": true
}
```

---

## 📊 Results Endpoints

### Get Election Results
```http
GET /api/results?election_id=1
Authorization: Bearer YOUR_TOKEN
```

**Response:**
```json
{
  "election": {
    "id": 1,
    "title": "Student Council Election 2024",
    "description": "Vote for your representatives"
  },
  "total_votes": 150,
  "results": [
    {
      "id": 1,
      "name": "Jane Smith",
      "position": "President",
      "vote_count": 85,
      "percentage": 56.67
    },
    {
      "id": 2,
      "name": "John Doe",
      "position": "President",
      "vote_count": 65,
      "percentage": 43.33
    }
  ]
}
```

### Get Statistics (Admin Only)
```http
GET /api/statistics
Authorization: Bearer ADMIN_TOKEN
```

**Response:**
```json
{
  "total_elections": 5,
  "active_elections": 1,
  "total_votes": 450,
  "total_candidates": 12
}
```

---

## 🧪 Testing with cURL

### Register
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "student_id": "TEST001",
    "password": "password123",
    "password_confirmation": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@school.com",
    "password": "password"
  }'
```

### Get Elections (with token)
```bash
curl -X GET http://localhost:8000/api/elections \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Submit Vote
```bash
curl -X POST http://localhost:8000/api/vote \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "candidate_id": 1,
    "election_id": 1
  }'
```

---

## 🧪 Testing with Postman

### Setup
1. Create new collection: "School Voting System"
2. Add environment variable: `base_url` = `http://localhost:8000/api`
3. Add environment variable: `token` = (will be set after login)

### Collection Structure
```
School Voting System/
├── Auth/
│   ├── Register
│   ├── Login
│   ├── Get Me
│   └── Logout
├── Elections/
│   ├── Get All
│   ├── Get Active
│   ├── Create (Admin)
│   └── Update (Admin)
├── Candidates/
│   ├── Get All
│   ├── Create (Admin)
│   └── Delete (Admin)
├── Voting/
│   ├── Submit Vote
│   └── Check Status
└── Results/
    ├── Get Results
    └── Get Statistics (Admin)
```

### Auto-Set Token Script
Add to Login request's "Tests" tab:
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("token", response.token);
}
```

---

## ⚠️ Common Errors

### 401 Unauthorized
```json
{
  "message": "Unauthenticated."
}
```
**Solution**: Include valid Bearer token

### 403 Forbidden
```json
{
  "message": "Unauthorized"
}
```
**Solution**: Use admin account for admin endpoints

### 422 Validation Error
```json
{
  "message": "The email has already been taken.",
  "errors": {
    "email": ["The email has already been taken."]
  }
}
```
**Solution**: Fix validation errors in request

### 404 Not Found
```json
{
  "message": "No query results for model [App\\Models\\Election] 1"
}
```
**Solution**: Check if resource exists

---

## 📋 Test Checklist

### Student Flow
- [ ] Register new student
- [ ] Login with credentials
- [ ] View active election
- [ ] View candidates
- [ ] Submit vote
- [ ] Check vote status
- [ ] View results
- [ ] Logout

### Admin Flow
- [ ] Login as admin
- [ ] Create new election
- [ ] Add candidates
- [ ] Update election status
- [ ] View statistics
- [ ] Delete candidate
- [ ] Delete election

---

## 🔍 Debugging Tips

1. **Check Laravel Logs**: `backend/storage/logs/laravel.log`
2. **Enable Debug Mode**: Set `APP_DEBUG=true` in `.env`
3. **Test Database**: Use `php artisan tinker`
4. **Check Routes**: Run `php artisan route:list`
5. **Clear Cache**: Run `php artisan config:clear`

---

Happy Testing! 🚀
