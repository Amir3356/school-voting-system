<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10B981; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .vote-details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #10B981; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>✓ Vote Confirmed</h1>
        </div>
        <div class="content">
            <h2>Hello {{ $user->name }}!</h2>
            <p>Your vote has been successfully recorded.</p>
            <div class="vote-details">
                <h3>{{ $election->title }}</h3>
                <p><strong>Candidate:</strong> {{ $candidate->name }}</p>
                <p><strong>Position:</strong> {{ $candidate->position }}</p>
                <p><strong>Voted at:</strong> {{ now()->format('F d, Y h:i A') }}</p>
            </div>
            <p>Thank you for participating in the democratic process!</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} School Voting System. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
