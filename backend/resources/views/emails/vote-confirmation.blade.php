<!DOCTYPE html>
<html>
<head>
    <title>Vote Confirmation</title>
</head>
<body>
    <h1>Vote Confirmation</h1>
    
    <p>Dear {{ $user->name }},</p>
    
    <p>Your vote has been successfully recorded in the School Voting System.</p>
    
    <p><strong>Vote Details:</strong></p>
    <ul>
        <li>Election: {{ $election->title }}</li>
        <li>Position: {{ $candidate->position }}</li>
        <li>Candidate: {{ $candidate->user->name }}</li>
        <li>Vote Date: {{ now()->format('F j, Y, g:i a') }}</li>
    </ul>
    
    <p>Thank you for participating in the democratic process. You can view the live results on the dashboard.</p>
    
    <p>Best regards,<br>School Voting System Team</p>
</body>
</html>
