<?php
error_reporting(0); 
ini_set('display_errors', 0);

require_once '../db_connect.php'; 

// // Kiểm tra: Phả đồ chỉ dành cho người đã đăng nhập 
// if (!isset($_SESSION['logged_in']) || $_SESSION['logged_in'] !== true) {
//     http_response_code(401); // Unauthorized
//     echo json_encode(["message" => "Truy cập bị từ chối. Vui lòng đăng nhập."]);
//     exit(); // Dừng ngay lập tức
// }

if (!isset($conn) || $conn->connect_error) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(["message" => "Lỗi kết nối CSDL: " . ($conn->connect_error ?? 'Không rõ lỗi')]);
    die();
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(["message" => "Phương thức không hợp lệ. Chỉ chấp nhận GET."]);
    $conn->close();
    die();
}

$rawMembers = [];
$marriages = [];

$sql = "
    SELECT 
        TCN.IDCaNhan AS id,
        TCN.Ten,
        TCN.GioiTinh,
        TCN.TheHe AS generation,
        TCN.URLAnh AS image_url, 
        QHCC.IDCha AS pid,
        QHCC.IDMe AS mid
    FROM ThongTinCaNhan TCN
    LEFT JOIN QuanHeConCai QHCC ON QHCC.IDCon = TCN.IDCaNhan
    ORDER BY TCN.TheHe ASC, TCN.IDCaNhan ASC
";

$result = $conn->query($sql);

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $row['id'] = (int)$row['id'];
        $row['pid'] = isset($row['pid']) ? (int)$row['pid'] : null;
        $row['mid'] = isset($row['mid']) ? (int)$row['mid'] : null;
        $row['generation'] = isset($row['generation']) ? (int)$row['generation'] : 0;
        $row['image_url'] = $row['image_url'] ?? null;

        // Xử lý vai trò đặc biệt và tạo trường 'name'
        $ten = $row['Ten'] ?? 'Không rõ tên';
        $extra = '';

        if (strpos($ten, '(Khởi Tổ)') !== false) {
            $extra = 'Khởi Tổ';
            $ten = str_replace(' (Khởi Tổ)', '', $ten);
        } elseif (strpos($ten, '(Vợ Tổ)') !== false) {
            $extra = 'Vợ Tổ';
            $ten = str_replace(' (Vợ Tổ)', '', $ten);
        } elseif (strpos($ten, '(Admin)') !== false) {
            $extra = 'Admin';
            $ten = str_replace(' (Admin)', '', $ten);
        }

        $row['name'] = trim($ten) . ($extra ? " ($extra)" : '');

        $rawMembers[$row['id']] = $row;
    }
} else {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(["message" => "Lỗi truy vấn thành viên: " . $conn->error]);
    $conn->close();
    die();
}

$sqlMarriage = "
    SELECT IDVoChong1, IDVoChong2
    FROM HonNhan
    WHERE TrangThai = 'Đã Kết Hôn'
";
$resMarriage = $conn->query($sqlMarriage);

if ($resMarriage) {
    while ($m = $resMarriage->fetch_assoc()) {
        $id1 = (int)$m['IDVoChong1'];
        $id2 = (int)$m['IDVoChong2'];
        if ($id1 && $id2) {
            $marriages[$id1] = $id2;
            $marriages[$id2] = $id1;
        }
    }
} else {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(["message" => "Lỗi truy vấn hôn nhân: " . $conn->error]);
    $conn->close();
    die();
}

$finalMembers = [];

foreach ($rawMembers as $id => $m) {
    $m['spouse_id'] = isset($marriages[$id]) ? (int)$marriages[$id] : null;
    unset($m['mid']); 
    $finalMembers[] = $m;
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($finalMembers, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
$conn->close();
?>
