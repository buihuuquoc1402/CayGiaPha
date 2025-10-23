// csript/templating.js

import { newsData, galleryData, eventData } from './data.js';

export function setupNewsCardEvents() {
    // Gắn sự kiện click cho các thẻ tin tức
    const newsCards = document.querySelectorAll('.news-card');
    newsCards.forEach(card => {
        card.addEventListener('click', function () {
            const newsId = this.dataset.id;
            // Gọi hàm chuyển trang chi tiết
            window.location.hash = `#newsdetail/${newsId}`;
        });
    });
}

// Hàm 1: Tạo HTML cho lưới tin tức
export function createNewsGrid(data) {
    if (!data || data.length === 0) {
        return `<p style="text-align: center; padding: 30px;">Hiện tại chưa có bài viết nào trong mục này.</p>`;
    }
    return `
        <div class="news-grid">
            ${data.map(item => `
                <div class="news-card" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.title}" class="news-image">
                    <div class="news-info">
                        <h3>${item.title}</h3>
                        <p class="news-date">${item.date}</p>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Hàm 2: Tạo HTML cho lưới thư viện
export function createGalleryGrid(data) {
    if (!data || data.length === 0) {
        return `<p style="text-align: center; padding: 30px;">Hiện tại chưa có album nào trong Thư Viện.</p>`;
    }
    return `
        <div class="gallery-grid">
            ${data.map(item => `
                <div class="gallery-card" data-id="${item.id}">
                    <img src="${item.image}" alt="${item.title}" class="gallery-image">
                    <div class="gallery-info">
                        <h3>${item.title}</h3>
                        <div class="album-tag">
                            <span class="date-tag">${item.date}</span>
                            <span class="tag-album">
                                <i class="fa fa-camera"></i> Album
                            </span>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Hàm 3: Tạo HTML cho Timeline sự kiện
export function createEventTimeline(data) {
    if (!data || data.length === 0) {
        return `<p style="text-align: center; padding: 30px;">Hiện tại chưa có sự kiện nào được lên lịch.</p>`;
    }

    const header = `
        <div class="event-header">
            <button class="register-event-button">Đăng ký thông báo sự kiện</button>
        </div>
    `;

    const timelineHtml = data.map((item, index) => {
        const contentClass = index % 2 === 0 ? 'content-right' : 'content-left';
        const timeDetailsHtml = item.timeDetails.map(detail => `<li>- ${detail}</li>`).join('');

        return `
            <div class="timeline-item">
                <div class="date-box ${index % 2 !== 0 ? 'date-box-left' : ''}">
                    <span class="date-gregorian">${item.date}</span>
                    <span class="date-lunar">${item.lunarDate}</span>
                </div>
                
                <div class="timeline-dot"></div>

                <div class="content-box ${contentClass}">
                    <h3>${item.title}</h3>
                    <ul>
                        ${timeDetailsHtml}
                    </ul>
                    <p class="event-location">${item.location}</p>
                    <p class="event-note">${item.note}</p>
                </div>
            </div>
        `;
    }).join('');

    return `${header}<div class="timeline-container">${timelineHtml}</div>`;
}

// Hàm 4: Tạo HTML cho Trang Chi Tiết Tin Tức
// Giả định đơn giản cho trang chi tiết
export const newsdetailContent = (id) => {
    const item = newsData.find(n => n.id === id);
    if (!item) return `<h2>Không tìm thấy tin tức</h2><p>Tin tức bạn đang tìm kiếm không tồn tại.</p>`;

    return `
        <div class="news-detail-page">
            <button class="back-button" onclick="window.history.back()">Quay lại</button>
            <h2>${item.title}</h2>
            <p class="detail-date">Ngày đăng: ${item.date} - Thuộc mục: ${item.category.toUpperCase()}</p>
            <img src="${item.image}" alt="${item.title}" class="detail-image">
            <p style="font-style: italic; font-weight: bold;">${item.shortDesc}</p>
            <p>Đây là nội dung chi tiết cho bài viết số ${item.id} (${item.title}). Thường sẽ là một đoạn văn dài mô tả đầy đủ sự kiện hoặc thông tin liên quan. Để demo, chúng ta sẽ lặp lại đoạn text này vài lần.</p>
            <p>Đây là nội dung chi tiết cho bài viết số ${item.id} (${item.title}). Đây là nội dung chi tiết cho bài viết số ${item.id} (${item.title}). Đây là nội dung chi tiết cho bài viết số ${item.id} (${item.title}).</p>
        </div>
    `;
};

// Hàm 5: Tạo HTML cho Trang Chi Tiết Album
// Giả định đơn giản cho trang chi tiết album
export const gallerydetailContent = (id) => {
    const album = galleryData.find(g => g.id === id);
    if (!album) return `<h2>Không tìm thấy Album</h2><p>Album bạn đang tìm kiếm không tồn tại.</p>`;

    // Giả định 6 ảnh demo cho mỗi album
    const photoListHtml = Array(6).fill(0).map((_, index) =>
        `<img src="${album.image}" alt="${album.title} - Ảnh ${index + 1}" class="gallery-photo">`
    ).join('');

    return `
        <div class="news-detail-page">
            <button class="back-button" onclick="window.history.back()">Quay lại</button>
            <h2>Album: ${album.title}</h2>
            <p class="detail-date">Ngày tổ chức: ${album.date}</p>
            <p style="margin-bottom: 20px;">Tuyển tập hình ảnh đẹp trong sự kiện/chủ đề **${album.title}**.</p>
            
            <div class="photo-list">
                ${photoListHtml}
            </div>
        </div>
    `;
};

// 6. Định nghĩa nội dung cho tất cả các trang
export const pages = {
    trangchu: `
        <div class="content-section">
            
            <div class="intro-section">
                
                <div class="house-image-container">
                    <img src="../images/nha_tho.png" alt="Nhà Thờ Tổ Họ Nguyễn" class="house-image">
                </div>
                
                <div class="intro-text">
                    <h2>LỜI NÓI ĐẦU</h2>
                    <p>Trong thời đại công nghệ thông tin phát triển mạnh mẽ, Internet đã trở thành công cụ giới thiệu và dễ dàng tiếp cận. Nhiều dòng họ đã lựa chọn lưu giữ gia phả trực tuyến như một cách bảo tồn và lan tỏa giá trị truyền thống. Theo xu hướng đó, website www.honguyengiaphaviet.vn ra đời, là nơi lưu trữ gia phả trực tuyến dành riêng cho dòng họ Nguyễn. Đây là cầu nối giúp các thành viên dòng họ, dù ở bất kỳ nơi đâu, có thể tìm hiểu về lịch sử tổ tiên và quy trì mối quan hệ huyết thống.</p>
                    <p>Trang web này được xây dựng với tấm lòng biết ơn và kính trọng tổ tiên, khởi nguồn từ tâm huyết của anh Nguyễn Minh Nhàn - một hậu duệ đời thứ 14 của dòng họ Nguyễn. Tấm lòng cao đẹp này đã nhận được sự ủng hộ nhiệt tình từ các thành viên trong dòng họ, với kỳ vọng con cháu họ Nguyễn sẽ không ngừng phát triển và góp phần xây dựng quê hương đất nước ngày càng thịnh vượng.</p>
                </div>
            </div>

            <h2 class="section-title">Tin Tức</h2>
            ${createNewsGrid(newsData.slice(0, 9))}
            <h2 class="section-title">Phả Ký</h2>
            ${createNewsGrid(newsData.filter(item => item.category === 'phaky'))}
            <h2 class="section-title">Công Đức</h2>
            ${createNewsGrid(newsData.filter(item => item.category === 'congduc'))}

        </div>
    `,
    phaky: `
        <div class="content-section">
            <h2 class="section-title">Phả Ký</h2>
            <p>Tuyển tập các bài viết, chuyên đề về lịch sử, thế phả và các vấn đề liên quan đến Phả Ký dòng họ.</p>
            ${createNewsGrid(newsData.filter(item => item.category === 'phaky'))}
        </div>
    `,
    phido: `
    <div class="content-section phado-page">
        <h2 class="section-title">PHẢ ĐỒ DÒNG HỌ NGUYỄN</h2>
        
        <div class="phado-controls">
            <label for="pido-select">Chọn Phả Đồ:</label>
            <select id="pido-select">
                <option value="1">Phả đồ họ Nguyễn (phả đồ tổng)</option>
            </select>
            <span class="pido-stats">Tổng: <span id="member-count">0</span> thành viên | Thế hệ: <span id="generation-count">0</span></span>
        </div>

        <div class="phado-toggles">
            <button class="phado-button" id="toggle-limit">Giới hạn hiển thị</button>
            <button class="phado-button" id="toggle-ancestors">Quan hệ xưng hô</button>
            <button class="phado-button" id="toggle-notes">Ẩn/Hiện Chú thích</button>
        </div>
        
        <div id="phado-chart-container" class="chart-container" style="width:100%; height:700px; border:1px solid #ccc;">
            Đang tải Phả Đồ...
        </div>
    </div>
`,
    congduc: `
        <div class="content-section">
            <h2 class="section-title">Công Đức</h2>
            <p>Ghi nhận và tri ân những đóng góp của con cháu, thành viên trong việc xây dựng và duy trì dòng họ.</p>
            ${createNewsGrid(newsData.filter(item => item.category === 'congduc'))}
        </div>
    `,
    thuvien: `
        <div class="content-section">
            <h2 class="section-title">THƯ VIỆN HÌNH ẢNH</h2>
            <p style="text-align: center;">Tuyển tập các album ảnh và tài liệu quý giá của dòng họ.</p>
            ${createGalleryGrid(galleryData)}
        </div>
    `,
    sukien: `
        <div class="content-section">
            <h2 class="section-title">CÁC SỰ KIỆN QUAN TRỌNG CỦA DÒNG HỌ</h2>
            ${createEventTimeline(eventData)}
        </div>
    `,
    tintuc: `
        <div class="content-section">
            <h2 class="section-title">Tin Tức</h2>
            <p>Các tin tức mới nhất về dòng họ và cộng đồng.</p>
            ${createNewsGrid(newsData)} 
        </div>
    `,
    newsdetail: newsdetailContent,
    gallerydetail: gallerydetailContent
};