<?php
session_start();
require_once '../db_connect.php';
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $username = trim($data['username'] ?? '');
    $password = trim($data['password'] ?? '');

    if ($username === '' || $password === '') {
        http_response_code(400);
        echo json_encode([
            "success" => false,
            "message" => "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu."
        ]);
        exit;
    }

    $stmt = $conn->prepare("
        SELECT IDCaNhan, MatKhau, VaiTro, TenNguoiDung 
        FROM nguoi_dung 
        WHERE TenNguoiDung = ?
    ");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    $user = $result->fetch_assoc();
    $stmt->close();

    if (!$user) {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "Tên đăng nhập hoặc mật khẩu không đúng."
        ]);
        exit;
    }

    $is_password_valid = ($password === $user['MatKhau']);

    if ($is_password_valid) {
        $_SESSION['logged_in'] = true;
        $_SESSION['user_id'] = $user['IDCaNhan'];
        $_SESSION['role'] = $user['VaiTro'];
        $_SESSION['username'] = $user['TenNguoiDung'];

        echo json_encode([
            "success" => true,
            "message" => "Đăng nhập thành công!",
            "user" => [
                "id" => $user['IDCaNhan'],
                "username" => $user['TenNguoiDung'],
                "role" => $user['VaiTro']
            ]
        ]);
    } else {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "Tên đăng nhập hoặc mật khẩu không đúng."
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Phương thức không hợp lệ."
    ]);
}

$conn->close();
?>
