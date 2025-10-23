<?php

// Session
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}

// Cấu hình kết nối cơ sở dữ liệu
define('DB_SERVER', '127.0.0.1');
define('DB_USERNAME', 'root');    
define('DB_PASSWORD', '');        
define('DB_NAME', 'caygiapha'); 
define('DB_PORT', 3307); 

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Tạo kết nối MySQLi
$conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME, 3307);

// Kiểm tra kết nối
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(array("message" => "Lỗi kết nối CSDL: " . $conn->connect_error));
    exit();
}

$conn->set_charset("utf8mb4");

?>