<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #6366F1; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9f9f9; }
        .result-item { background: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
        .winner { border-left: 4px solid #10B981; }
        .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Election Results</h1>
        </div>
        <div class="content">
            <h2>Hello {{ $user->name }}!</h2>
            <p>The results for <strong>{{ $election->title }}</strong> are now available.</p>
            @foreach($results as $index => $result)
            <div class="result-item {{ $index === 0 ? 'winner' : '' }}">
                <h3>{{ $result['name'] }} {{ $index === 0 ? '🏆' : '' }}</h3>
                <p><strong>Position:</strong> {{ $result['position'] }}</p>
                <p><strong>Votes:</strong> {{ $result['votes'] }} ({{ number_format($result['percentage'], 2) }}%)</p>
            </div>
            @endforeach
            <p><strong>Total Votes:</strong> {{ $election->total_votes }}</p>
            <p><strong>Turnout:</strong> {{ number_format($election->turnout_percentage, 2) }}%</p>
        </div>
        <div class="footer">
            <p>&copy; {{ date('Y') }} School Voting System. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
