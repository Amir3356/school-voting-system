<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #4F46E5; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to School Voting System</h1>
        </div>
        <div class="content">
            <h2>Hello {{ $user->name }}!</h2>
            <p>Your account has been successfully created.</p>
            <p><strong>Email:</strong> {{ $user->email }}</p>
            <p><strong>Role:</strong> {{ ucfirst($user->role) }}</p>
            @if($user->student_id)
            <p><strong>Student ID:</strong> {{ $user->student_id }}</p>
            @endif
            <p>You can now log in and participate in school elections.</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} School Voting System. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
