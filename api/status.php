<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
header('Content-Type: application/json; charset=utf-8');

$is_logged_in = isset($_SESSION['logged_in']) && $_SESSION['logged_in'] === true;

if ($is_logged_in) {
    echo json_encode([
        "logged_in" => true,
        "user_id" => $_SESSION['user_id'],
        "username" => $_SESSION['username'],
        "role" => $_SESSION['role']
    ]);
} else {
    echo json_encode(["logged_in" => false, "role" => "Khách"]);
}
?>