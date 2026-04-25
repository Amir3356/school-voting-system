<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10b981; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        .success { background: #d1fae5; padding: 15px; border-radius: 5px; margin: 15px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Vote Submitted Successfully!</h1>
        </div>
        <div class="content">
            <h2>Hello {{ $user->name }}!</h2>
            <div class="success">
                <p><strong>✓ Your vote has been recorded</strong></p>
            </div>
            <p><strong>Election:</strong> {{ $election->title }}</p>
            <p><strong>Your Vote:</strong> {{ $candidate->name }} - {{ $candidate->position }}</p>
            <p><strong>Date:</strong> {{ now()->format('F d, Y h:i A') }}</p>
            <p>Thank you for participating in the democratic process!</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} School Voting System. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
