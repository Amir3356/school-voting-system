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
            <h1>Election Update</h1>
        </div>
        <div class="content">
            <h2>{{ $election->title }}</h2>
            <p><strong>Status:</strong> {{ ucfirst($election->status) }}</p>
            <p>{{ $election->description }}</p>
            @if($election->status === 'active')
                <p><strong>Voting Period:</strong></p>
                <p>From: {{ $election->start_date->format('F d, Y h:i A') }}</p>
                <p>To: {{ $election->end_date->format('F d, Y h:i A') }}</p>
                <p>Cast your vote now!</p>
            @elseif($election->status === 'completed')
                <p>This election has ended. Check the results page to see the outcome.</p>
            @endif
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} School Voting System. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
