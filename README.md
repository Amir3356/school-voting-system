# 🗳️ School Voting System

A full-stack democratic voting platform for schools built with Next.js and Laravel.

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router), Tailwind CSS
- **Backend**: Laravel 13, MySQL
- **Authentication**: Laravel Sanctum
- **Email**: Gmail SMTP

## 📁 Project Structure

```
school-voting-system/
├── frontend/          # Next.js frontend
│   ├── app/          # App Router pages
│   ├── components/   # React components
│   └── lib/          # API utilities
└── backend/          # Laravel backend
    ├── app/          # MVC structure
    ├── database/     # Migrations & seeders
    └── routes/       # API routes
```

## ⚙️ Setup Instructions

### Prerequisites

- Node.js 18+
- PHP 8.3+
- Composer
- MySQL (XAMPP)
- Gmail account with App Password

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
composer install
```

3. Configure database in `.env`:
```env
DB_DATABASE=school_voting_system
DB_USERNAME=root
DB_PASSWORD=
```

4. Configure Gmail SMTP in `.env`:
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your_email@gmail.com
```

5. Create database in MySQL:
```sql
CREATE DATABASE school_voting_system;
```

6. Run migrations and seeders:
```bash
php artisan migrate
php artisan db:seed
```

7. Start Laravel server:
```bash
php artisan serve
```

Backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure API URL in `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

4. Start development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

## 🔐 Default Credentials

### Admin Account
- Email: `admin@school.com`
- Password: `password`
- Student ID: `ADMIN001`

### Student Account
- Email: `student@school.com`
- Password: `password`
- Student ID: `STU001`

## 📧 Gmail App Password Setup

1. Go to Google Account Settings
2. Enable 2-Factor Authentication
3. Go to Security → App Passwords
4. Generate new app password for "Mail"
5. Copy the 16-character password
6. Paste in `.env` as `MAIL_PASSWORD`

## 🎯 Features

### Student Features
- ✅ Register & Login
- ✅ View candidates
- ✅ Cast vote (one per election)
- ✅ View live results
- ✅ Email notifications

### Admin Features
- ✅ Create/Edit/Delete elections
- ✅ Manage candidates
- ✅ View voting statistics
- ✅ Monitor results

## 📡 API Endpoints

### Public Routes
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Protected Routes
- `GET /api/me` - Get current user
- `GET /api/elections` - List all elections
- `GET /api/elections/active` - Get active election
- `GET /api/candidates` - List candidates
- `POST /api/vote` - Submit vote
- `GET /api/results` - View results

### Admin Routes
- `POST /api/elections` - Create election
- `PUT /api/elections/{id}` - Update election
- `DELETE /api/elections/{id}` - Delete election
- `POST /api/candidates` - Add candidate
- `PUT /api/candidates/{id}` - Update candidate
- `DELETE /api/candidates/{id}` - Delete candidate

## 📧 Email Notifications

Emails are sent for:
- ✅ User registration (Welcome email)
- ✅ Vote confirmation
- ✅ Election status changes
- ✅ New candidate added

## 🔒 Security Features

- One vote per student per election
- Password hashing with bcrypt
- CSRF protection
- API token authentication (Sanctum)
- Protected admin routes

## 🎨 UI Design

- Clean, modern interface
- Responsive mobile-first design
- Blue, white, green color scheme
- Card-based layouts
- Smooth transitions

## 🛠️ Development Commands

### Backend
```bash
php artisan migrate:fresh --seed  # Reset database
php artisan route:list            # View all routes
php artisan tinker                # Laravel REPL
```

### Frontend
```bash
npm run dev    # Development server
npm run build  # Production build
npm run start  # Production server
```

## 📝 License

MIT License - feel free to use for educational purposes.

## 🤝 Contributing

This is a school project. Feel free to fork and customize for your needs!

---

Built with ❤️ for democratic school elections
