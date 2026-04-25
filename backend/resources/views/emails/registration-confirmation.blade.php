<!DOCTYPE html>
<html>
<head>
    <title>Registration Confirmation</title>
</head>
<body>
    <h1>Welcome to School Voting System</h1>
    
    <p>Dear {{ $user->name }},</p>
    
    <p>Thank you for registering with the School Voting System. Your account has been successfully created.</p>
    
    <p><strong>Your Details:</strong></p>
    <ul>
        <li>Name: {{ $user->name }}</li>
        <li>Email: {{ $user->email }}</li>
        <li>Role: {{ ucfirst($user->role) }}</li>
    </ul>
    
    <p>You can now log in to the system and participate in upcoming elections.</p>
    
    <p>Best regards,<br>School Voting System Team</p>
</body>
</html>
