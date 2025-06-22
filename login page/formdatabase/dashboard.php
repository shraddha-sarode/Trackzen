<?php
session_start();

if (!isset($_SESSION['user_id'])) {
    header("Location: login.html");
    exit();
}

// ✅ Establish MySQL connection
$conn = new mysqli('localhost', 'root', '', 'login');

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$user_id = $_SESSION['user_id'];

// ✅ Fetch user info
$userQuery = $conn->prepare("SELECT username, email FROM registration WHERE id = ?");
$userQuery->bind_param("i", $user_id);
$userQuery->execute();
$user = $userQuery->get_result()->fetch_assoc();

// ✅ Fetch activity log
$activityQuery = $conn->prepare("SELECT type, description, created_at FROM activities WHERE user_id = ? ORDER BY created_at DESC");
$activityQuery->bind_param("i", $user_id);
$activityQuery->execute();
$activities = $activityQuery->get_result();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>User Dashboard</title>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: 'Poppins', sans-serif;
      background: linear-gradient(to right, #667eea, #764ba2);
      color: #fff;
      padding: 2rem;
      min-height: 100vh;
    }
    .dashboard {
      max-width: 800px;
      margin: auto;
      background: rgba(255, 255, 255, 0.05);
      border-radius: 15px;
      padding: 2rem;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
      backdrop-filter: blur(10px);
    }
    .dashboard h2 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    .dashboard p {
      font-size: 1rem;
      margin-bottom: 1.5rem;
    }
    .dashboard h3 {
      font-size: 1.5rem;
      margin-bottom: 1rem;
    }
    ul {
      list-style: none;
      padding-left: 0;
    }
    li {
      background: rgba(255, 255, 255, 0.08);
      padding: 1rem;
      margin-bottom: 1rem;
      border-radius: 10px;
      transition: transform 0.2s ease;
    }
    li:hover {
      transform: translateX(5px);
    }
    strong {
      color: #ffd700;
    }
  </style>
</head>
<body>
  <div class="dashboard">
    <h2>Welcome, <?= htmlspecialchars($user['username']) ?>!</h2>
    <p>Email: <?= htmlspecialchars($user['email']) ?></p>

    <h3>Recent Activities</h3>
    <ul>
      <?php while ($act = $activities->fetch_assoc()): ?>
        <li><strong><?= $act['type'] ?>:</strong> <?= $act['description'] ?> on <?= $act['created_at'] ?></li>
      <?php endwhile; ?>
    </ul>
  </div>
</body>
</html>

