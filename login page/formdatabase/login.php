<?php
ob_start();
session_start();

$con = new mysqli('localhost', 'root', '', 'login');

if ($con->connect_error) {
    die("❌ Connection failed: " . $con->connect_error);
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Prepared statement to prevent SQL injection
    $stmt = $con->prepare("SELECT * FROM registration WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 1) {
        $user = $result->fetch_assoc();

        // Check hashed password
        if (password_verify($password, $user['password'])) {
            // ✅ Store user data in session
            $_SESSION['user_id'] = $user['id'];
            $_SESSION['username'] = $user['username'];
            $_SESSION['email'] = $user['email'];

            // ✅ Redirect to PHP-based main page
            header("Location: mainpage.html");
            exit();
        } else {
            echo "❌ Incorrect password. Try again!";
        }
    } else {
        echo "❌ User not found!";
    }

    $stmt->close();
    $con->close();
}

ob_end_flush();
?>
