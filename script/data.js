// js/data.js

export const newsData = [
    // Tin tức chung hoặc sự kiện/tin tức nổi bật
    { id: '1', title: 'Danh sách Công Đức xây dựng Nhà Thờ', date: '07/07/2025', image: '../images/tintuc-1.png', shortDesc: 'Danh sách công đức của các thành viên đóng góp xây dựng Nhà Thờ Tổ họ Nguyễn Việt Nam.', category: 'congduc' },
    { id: '2', title: 'Lời Ngỏ: Con người có tổ có tông', date: '17/06/2025', image: '../images/tintuc-2.png', shortDesc: 'Trích dẫn Lời Ngỏ ý nghĩa về cội nguồn và gia đình.', category: 'phaky' },
    { id: '3', title: 'Phả ký dòng họ Nguyễn', date: '17/06/2025', image: '../images/tintuc-3.png', shortDesc: 'Giới thiệu sơ lược về lịch sử và quy mô Phả Ký dòng họ Nguyễn.', category: 'phaky' },
    { id: '4', title: 'Nhà thờ họ Nguyễn đã được trùng tu', date: '28/03/2025', image: '../images/tintuc-4.png', shortDesc: 'Thông tin chi tiết về quá trình trùng tu và khánh thành Nhà Thờ Tổ.', category: 'sukien' },
    // Văn khấn và lễ nghi (có thể xếp vào chuyên đề hoặc tin tức chung)
    { id: '5', title: 'Văn Khấn Ngày Giỗ Ông Bà - Cha Mẹ', date: '05/09/2024', image: '../images/tintuc-5.png', shortDesc: 'Các bài văn khấn truyền thống cho các ngày giỗ.', category: 'chuyende' },
    { id: '6', title: 'Văn Khấn cúng gia tiên, thần linh ngày thường', date: '05/09/2024', image: '../images/tintuc-6.png', shortDesc: 'Hướng dẫn bài văn khấn đơn giản, hàng tháng.', category: 'chuyende' },
    // Thêm các mục khác
    { id: '7', title: 'Lễ Vinh Danh - Phát Thưởng Học Sinh Giỏi', date: '05/09/2024', image: '../images/tintuc-7.png', shortDesc: 'Vinh danh học sinh giỏi năm học 2023-2024.', category: 'sukien' },
    { id: '8', title: 'Họ Nguyễn Phúc Thân Trà Và Nam Từ Chức Kỷ Niệm', date: '05/09/2024', image: '../images/tintuc-8.png', shortDesc: 'Thông tin về lễ kỷ niệm 20 năm.', category: 'sukien' },
    { id: '9', title: 'Văn Khấn chuẩn đón ông bà tổ tiên về nhà ăn Tết', date: '30/12/2024', image: '../images/tintuc-9.png', shortDesc: 'Văn khấn truyền thống cho ngày Tết.', category: 'chuyende' },
];

export const galleryData = [
    { id: 'g1', title: 'Tổ chức lễ phát thưởng con cháu (1/5/2025)', image: '../images/thuvien-1.png', date: '01/05/2025' },
    { id: 'g2', title: 'Nhà thờ tộc', image: '../images/thuvien-2.png', date: '01/01/2025' },
    { id: 'g3', title: 'Tết Giáp Thìn 2024', image: '../images/thuvien-3.png', date: '10/02/2024' },
    { id: 'g4', title: 'Gia đình ông Nguyễn Hiền', image: '../images/thuvien-4.png', date: '20/12/2024' },
    { id: 'g5', title: 'Đám cưới cháu Nguyễn Minh (29/2/2025)', image: '../images/thuvien-5.png', date: '29/02/2025' },
    { id: 'g6', title: 'Du lịch cùng nhau', image: '../images/thuvien-6.png', date: '05/06/2024' },
];

export const eventData = [
    {
        id: 'e1',
        title: 'Đám giỗ Cụ Nguyễn Khánh An',
        date: '24/04/2026',
        lunarDate: 'Nhằm 08/03/2026 âm lịch (Còn 190 ngày)',
        timeDetails: [
            '07:00 Đọc Kinh',
            '08:00 Thăm mộ Cụ',
            '09:00 Đọc Kinh'
        ],
        location: 'Địa điểm: 562 Điện Biên Phủ, Đà Nẵng',
        note: 'Ghi chú: Cụ Trần Khánh An do nhà Ông Trần Đại Nghĩa thờ phụng.'
    },
    {
        id: 'e2',
        title: 'Họp mặt đại gia đình',
        date: '30/10/2025',
        lunarDate: 'Nhằm 10/10/2025 âm lịch (Còn 14 ngày)',
        timeDetails: [
            'Họp tại nhà của ông Nguyễn Văn Cương.',
        ],
        location: 'Địa điểm: 535 Nguyễn Tất Thành, TP. Đà Nẵng',
        note: 'Ghi chú: Mọi thông tin chi tiết liên hệ ông Nguyễn Khắc Vương.'
    },
    {
        id: 'e3',
        title: 'Lễ Vinh Danh - Phát Thưởng Học Sinh Giỏi',
        date: '05/09/2026',
        lunarDate: 'Nhằm 15/07/2026 âm lịch',
        timeDetails: [
            '10:00 - 12:00 Tổ chức tại Nhà Thờ Tộc',
        ],
        location: 'Địa điểm: Nhà Thờ Nguyễn Tộc',
        note: 'Ghi chú: Đăng ký nhận thưởng qua ban tổ chức trước 31/08.'
    }
];