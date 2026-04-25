# 🗳️ School Voting System

A secure, role-based full-stack voting system for schools with email notifications via Gmail SMTP.

## 🚀 Features

- **Role-Based Authentication**: Admin and Student roles with JWT/Sanctum
- **Secure Voting**: One vote per election per student
- **Real-time Results**: Live vote counting and statistics
- **Email Notifications**: 
  - Welcome email on registration
  - Vote confirmation email
  - Election results email
- **Admin Dashboard**: Manage elections, candidates, and view reports
- **Student Dashboard**: View active elections and cast votes

## 📁 Project Structure

```
school-voting-system/
├── backend/          # Laravel API
│   ├── app/
│   │   ├── Http/Controllers/
│   │   ├── Models/
│   │   ├── Mail/
│   │   ├── Services/
│   │   └── Traits/
│   ├── database/migrations/
│   └── routes/api.php
│
└── frontend/         # React + Vite
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── services/
    │   ├── hooks/
    │   ├── context/
    │   └── router/
    └── package.json
```

## 🛠️ Setup Instructions

### Backend Setup (Laravel)

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
composer install
```

3. Configure environment:
```bash
cp .env.example .env
php artisan key:generate
```

4. Update `.env` with your database and Gmail SMTP settings:
```env
DB_DATABASE=School_Voting
DB_USERNAME=root
DB_PASSWORD=

MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="your-email@gmail.com"
MAIL_FROM_NAME="School Voting System"
```

5. Run migrations and seed:
```bash
php artisan migrate --seed
```

6. Install Laravel Sanctum:
```bash
composer require laravel/sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
```

7. Start the server:
```bash
php artisan serve
```

### Frontend Setup (React + Vite)

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
npm install react-router-dom axios
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

3. Update `.env`:
```env
VITE_API_URL=http://localhost:8000/api
```

4. Start development server:
```bash
npm run dev
```

## 📧 Gmail SMTP Setup

1. Enable 2-Factor Authentication on your Gmail account
2. Generate an App Password:
   - Go to Google Account Settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use the generated password in `MAIL_PASSWORD` (not your regular password)

## 👥 Default Users

After seeding, you can login with:

**Admin:**
- Email: admin@school.com
- Password: password

**Student:**
- Email: john@school.com
- Password: password

## 🔑 API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login
- `POST /api/logout` - Logout
- `GET /api/me` - Get current user

### Elections
- `GET /api/elections` - Get all elections
- `GET /api/elections/active` - Get active elections
- `POST /api/elections` - Create election (Admin)
- `PUT /api/elections/{id}` - Update election (Admin)
- `DELETE /api/elections/{id}` - Delete election (Admin)

### Candidates
- `GET /api/candidates` - Get all candidates
- `POST /api/candidates` - Create candidate (Admin)
- `PUT /api/candidates/{id}` - Update candidate (Admin)
- `DELETE /api/candidates/{id}` - Delete candidate (Admin)

### Voting
- `POST /api/votes` - Cast vote (Student)
- `GET /api/votes/my-votes` - Get user's votes
- `GET /api/votes/check/{electionId}` - Check if voted
- `GET /api/votes/results/{electionId}` - Get election results

## 🎨 Frontend Components

### Reusable Components
- `Button` - Customizable button with variants
- `Input` - Form input with validation
- `Modal` - Reusable modal dialog
- `Toast` - Notification component
- `Loader` - Loading spinner

### Custom Hooks
- `useApi` - API call management
- `useAuth` - Authentication state
- `useNotification` - Toast notifications

## 🔒 Security Features

- JWT/Sanctum authentication
- Role-based access control
- CORS protection
- Password hashing
- One vote per election enforcement
- Email verification ready

## 📊 Database Schema

- **users**: User accounts (admin/student)
- **elections**: Election details
- **candidates**: Candidate information
- **votes**: Vote records
- **notification_logs**: Email notification tracking

## 🚀 Deployment

### Backend
- Deploy to any PHP hosting (Laravel Forge, Heroku, DigitalOcean)
- Configure production database
- Set up queue workers for emails

### Frontend
- Build: `npm run build`
- Deploy to Vercel, Netlify, or any static hosting
- Update `VITE_API_URL` to production API

## 📝 License

MIT License

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.
