<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>School Voting System API</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px;">
        <h1>School Voting System API</h1>
        <p>Welcome to the School Voting System Backend API.</p>
        
        <h2>API Endpoints</h2>
        <ul>
            <li><strong>POST /api/register</strong> - Register a new user</li>
            <li><strong>POST /api/login</strong> - Login user</li>
            <li><strong>POST /api/logout</strong> - Logout user (protected)</li>
            <li><strong>GET /api/me</strong> - Get current user (protected)</li>
            <li><strong>POST /api/vote</strong> - Cast a vote (protected)</li>
            <li><strong>GET /api/results/{electionId}</strong> - Get election results (protected)</li>
            <li><strong>GET /api/candidates</strong> - Get all candidates (protected)</li>
        </ul>
        
        <p><em>This is the backend API. The frontend application should be served from the Next.js frontend directory.</em></p>
    </div>
</body>
</html>