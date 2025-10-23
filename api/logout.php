<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
// Xóa tất cả các biến session
$_SESSION = array();

// Nếu muốn hủy session cookie
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Hủy session
session_destroy();

header('Content-Type: application/json; charset=utf-8');
echo json_encode(["success" => true, "message" => "Đăng xuất thành công."]);
?>