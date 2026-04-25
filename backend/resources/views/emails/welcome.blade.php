<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
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
            <p>Thank you for registering with our School Voting System.</p>
            <p><strong>Your Details:</strong></p>
            <ul>
                <li>Name: {{ $user->name }}</li>
                <li>Email: {{ $user->email }}</li>
                <li>Student ID: {{ $user->student_id }}</li>
            </ul>
            <p>You can now participate in school elections and make your voice heard!</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} School Voting System. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
