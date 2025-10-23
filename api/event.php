<?php
// api/event.php

require_once './db_connect.php'; 

$events = [];

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    
    // Truy vấn Sự Kiện, sắp xếp theo ngày gần nhất
    $sql = "
        SELECT 
            IDSukien AS id, 
            TieuDe AS title, 
            NgayDienRaSuKien AS date_gregorian, 
            DiaDiem AS location, 
            MoTa AS details
        FROM SuKien
        ORDER BY NgayDienRaSuKien DESC";

    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            // Định dạng lại ngày tháng
            $row['date_gregorian'] = date('d/m/Y', strtotime($row['date_gregorian']));
            // Thêm các trường dữ liệu tĩnh tạm thời (ví dụ: ngày âm lịch)
            $row['date_lunar'] = 'Nhằm ' . date('d/m', strtotime($row['date_gregorian'])) . '/YYYY âm lịch';
            
            $events[] = $row;
        }
    }
    
    // Trả về phản hồi json
    http_response_code(200);
    echo json_encode($events);

} else {
    http_response_code(405);
    echo json_encode(["message" => "Phương thức không hợp lệ."]);
}

$conn->close();
?>