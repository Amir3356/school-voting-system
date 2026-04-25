# 📦 Installation Guide

## Step-by-Step Setup

### 1. Backend Setup (Laravel)

#### Install Dependencies
```bash
cd backend
composer install
composer require laravel/sanctum
```

#### Publish Sanctum Configuration
```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

#### Configure Environment
Edit `backend/.env` file:

```env
# Database Configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=school_voting_system
DB_USERNAME=root
DB_PASSWORD=

# Gmail SMTP Configuration
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_16_char_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your_email@gmail.com
MAIL_FROM_NAME="School Voting System"
```

#### Create Database
Open XAMPP MySQL or phpMyAdmin and run:
```sql
CREATE DATABASE school_voting_system;
```

#### Run Migrations
```bash
php artisan migrate
php artisan db:seed
```

#### Start Laravel Server
```bash
php artisan serve
```

Server runs on: `http://localhost:8000`

---

### 2. Frontend Setup (Next.js)

#### Install Dependencies
```bash
cd frontend
npm install
```

#### Configure Environment
Create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

#### Start Development Server
```bash
npm run dev
```

Server runs on: `http://localhost:3000`

---

## 🔧 Gmail App Password Setup

### Step 1: Enable 2-Factor Authentication
1. Go to [Google Account](https://myaccount.google.com/)
2. Click **Security**
3. Enable **2-Step Verification**

### Step 2: Generate App Password
1. Go to **Security** → **App Passwords**
2. Select **Mail** and **Other (Custom name)**
3. Enter "School Voting System"
4. Click **Generate**
5. Copy the 16-character password (remove spaces)
6. Paste in `.env` as `MAIL_PASSWORD`

---

## ✅ Verify Installation

### Test Backend
```bash
curl http://localhost:8000/api/elections
```

### Test Frontend
Open browser: `http://localhost:3000`

### Test Login
- Email: `admin@school.com`
- Password: `password`

---

## 🐛 Troubleshooting

### Database Connection Error
- Ensure XAMPP MySQL is running
- Check database name matches `.env`
- Verify credentials

### CORS Error
Add to `backend/config/cors.php`:
```php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:3000'],
```

### Email Not Sending
- Verify Gmail App Password (no spaces)
- Check 2FA is enabled
- Test with: `php artisan tinker` then `Mail::raw('Test', function($msg) { $msg->to('test@example.com')->subject('Test'); });`

### Port Already in Use
```bash
# Backend
php artisan serve --port=8001

# Frontend
npm run dev -- -p 3001
```

---

## 📚 Next Steps

1. Login as admin: `admin@school.com` / `password`
2. Create a new election
3. Add candidates
4. Set election status to "active"
5. Login as student and vote!

---

## 🔄 Reset Database

```bash
cd backend
php artisan migrate:fresh --seed
```

This will:
- Drop all tables
- Run migrations
- Seed default admin and student accounts
