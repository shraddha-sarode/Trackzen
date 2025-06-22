<?php
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
    $con = new mysqli('localhost', 'root', '', 'login');

    if ($con->connect_error) {
        die("❌ Connection failed: " . $con->connect_error);
    }

    $stmt = $con->prepare("INSERT INTO registration (username, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $username, $email, $hashedPassword);

    if ($stmt->execute()) {
        session_start();
        $_SESSION['user_id'] = $stmt->insert_id;
        $_SESSION['username'] = $username;
        $_SESSION['email'] = $email;

        // Optional: Insert into activities
        $activity = $con->prepare("INSERT INTO activities (user_id, type, description) VALUES (?, ?, ?)");
        $type = "Registration";
        $desc = "User registered successfully.";
        $activity->bind_param("iss", $_SESSION['user_id'], $type, $desc);
        $activity->execute();
        $activity->close();

        header("Location: mainpage.html");
        exit();
    } else {
        die("❌ Error: " . $stmt->error);
    }

    $stmt->close();
    $con->close();
}
?>
