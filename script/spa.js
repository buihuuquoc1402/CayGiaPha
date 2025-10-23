// Import các module cần thiết (giữ nguyên)
import {
    createNewsGrid,
    createGalleryGrid,
    createEventTimeline,
    newsdetailContent,
    gallerydetailContent,
    setupNewsCardEvents,
    pages
} from './templating.js';
import { setupModal, setupEventRegisterButton } from './modals.js';


const d3 = window.d3;
if (!d3 || typeof d3.tree !== 'function') {
    console.error("D3.js chưa được tải. Vui lòng kiểm tra thẻ <script>.");
}

// Hàm hỗ trợ: Xử lý xuống dòng
/**
 * @param {d3.selection} text - Đối tượng D3 selection của thẻ <text>
 * @param {number} width - Chiều rộng tối đa (tính bằng pixel)
 * @returns {number} Số dòng đã được wrap (số thẻ tspan).
 */
function wrapText(text, width) {
    let maxLines = 1;

    text.each(function () {
        const text = d3.select(this);
        const words = text.text().split(/\s+/).reverse();
        let word;
        let line = [];
        let lineNumber = 0;
        const lineHeight = 0.5; // ems
        const y = text.attr("y");
        const x = text.attr("x");
        const dy = parseFloat(text.attr("dy"));

        // Xóa text gốc và tạo thẻ tspan đầu tiên
        let tspan = text.text(null).append("tspan")
            .attr("x", x) // Giữ X=0 để căn giữa
            .attr("y", y)
            .attr("dy", dy + "em");

        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));

            // Kiểm tra độ rộng của dòng hiện tại. 
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                lineNumber++;

                // Tạo dòng mới (tspan)
                tspan = text.append("tspan")
                    .attr("x", x) // Giữ X=0 để căn giữa
                    .attr("y", y)
                    .attr("dy", lineNumber * lineHeight + dy + "em")
                    .text(word);
            }
        }
        maxLines = lineNumber + 1;
    });

    return maxLines;
}

// ===============================
// Hàm hỗ trợ: Ẩn/hiện node con
// ===============================

/**
 * Chuyển đổi trạng thái ẩn/hiện của các node con.
 * @param {object} d - Node D3 được nhấp.
 */
function toggleChildren(d) {
    if (d.children) {
        // Đang hiển thị -> Ẩn
        d._children = d.children;
        d.children = null;
    } else if (d._children) {
        // Đang ẩn -> Hiện
        d.children = d._children;
        d._children = null;
    }
}


// Xử lý dữ liệu thành cây D3 (Đã khôi phục)
function stratifyData(data, idField, parentField) {
    if (!Array.isArray(data) || data.length === 0) return null;

    const dataMap = new Map();
    let minGen = Infinity;

    // Khởi tạo node và tìm thế hệ nhỏ nhất (gốc)
    data.forEach(item => {
        item.generation = Number(item.generation) || 0;
        if (item.generation > 0 && item.generation < minGen) minGen = item.generation;
        item.children = [];
        dataMap.set(item[idField], item);
    });

    const allNodes = Array.from(dataMap.values());

    // Bước 1: Nối cha-con (kể cả trường hợp cha là vợ/chồng)
    allNodes.forEach(item => {
        let parentId = item[parentField];
        if (parentId) {
            let parent = dataMap.get(parentId);
            if (!parent) {
                // Nếu cha là vợ/chồng bị ẩn thì tìm người kia
                parent = Array.from(dataMap.values()).find(n => n.spid === parentId);
            }
            if (parent) {
                parent.children = parent.children || [];
                parent.children.push(item);
            }
        }
    });

    // Bước 2: Nối vợ chồng cùng tầng (để hiển thị cạnh nhau)
    allNodes.forEach(item => {
        if (item.spid) {
            const spouse = dataMap.get(item.spid);
            if (spouse) {
                item.spouse = spouse;
                spouse.spouse = item;
            }
        }
    });

    // Bước 3: Tìm node gốc (ông Tổ)
    const potentialRoots = allNodes.filter(item =>
        (!item[parentField] || item[parentField] === null) &&
        item.generation === minGen
    );

    let root = potentialRoots.length > 0
        ? potentialRoots.sort((a, b) => a.id - b.id)[0]
        : allNodes.sort((a, b) => a.generation - b.generation || a.id - b.id)[0];

    // Ẩn node vợ nếu là cùng gốc
    potentialRoots.forEach(item => {
        if (item.id !== root.id && item.spid === root.id) {
            item.children = undefined;
        }
    });

    return root;
}

let i = 0;
function drawD3Phado(nodeDataArray, chartContainer) {
    if (!d3 || typeof d3.tree !== 'function') {
        chartContainer.textContent = "Không tìm thấy thư viện D3.js.";
        return;
    }

    chartContainer.textContent = "";
    chartContainer.classList.add("d3-phado-container");

    const margin = { top: 40, right: 90, bottom: 40, left: 90 };
    const chartWidth = chartContainer.clientWidth - margin.left - margin.right;
    const defaultHeight = 800;

    // Thông số node
    const imageSize = 50; // ảnh
    const nodeBox = { width: 90, height: 120 }; // Kích thước hcn
    const nodeSize = { width: 160, height: 180 }; // Khoảng cách node cha-con

    const rectOffset = nodeBox.height / 2;
    const imageClipRadius = imageSize / 2;

    const boxHalfWidth = nodeBox.width / 2;
    const boxHalfHeight = nodeBox.height / 2;

    // Vị trí cố định của ảnh
    const imageY = -boxHalfHeight + 5;
    const imageX = -imageClipRadius;

    const textWrapWidth = nodeBox.width - 10; //Chiều rộng text

    // DY khởi tạo cho Tên 
    const baseNameDY = 1.0; // em
    const lineHeight = 1.1; // ems (Đồng bộ với hàm wrapText)
    const paddingNameGen = 1.7; // Khoảng cách giữa Tên và Thế hệ

    const svg = d3.select(chartContainer).append("svg")
        .attr("width", chartWidth + margin.left + margin.right)
        .attr("height", defaultHeight + margin.top + margin.bottom);

    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);

    const rootData = stratifyData(nodeDataArray, 'id', 'pid');
    if (!rootData || typeof rootData !== 'object') {
        chartContainer.textContent = "Không có dữ liệu gốc để vẽ cây.";
        return;
    }

    // Cập nhật khoảng cách node
    const treeLayout = d3.tree().nodeSize([nodeSize.width + 60, nodeSize.height + 40]);
    let nodes = treeLayout(d3.hierarchy(rootData, d => d.children));

    const nodePositionMap = new Map(nodes.descendants().map(d => [d.data.id, d]));
    const drawnNodeIds = new Set(nodePositionMap.keys());

    // Vẽ các node trong cây chính
    const node = g.selectAll(".d3-node")
        .data(nodes.descendants())
        .enter().append("g")
        .attr("class", d => `d3-node ${d.data.gender === "Nam" ? 'male' : 'female'}`)
        .attr("transform", d => `translate(${d.x},${d.y})`);

    // 1. Hình chữ nhật (Rect)
    node.append("rect")
        .attr("width", nodeBox.width).attr("height", nodeBox.height)
        .attr("x", -boxHalfWidth).attr("y", -boxHalfHeight).attr("rx", 5)
        .style("fill", "#fff").style("stroke", d => d.data.genderColor);

    // 2. Ảnh đại diện (Căn giữa theo X)
    node.append("image")
        .attr("xlink:href", d => d.data.image)
        .attr("x", -imageClipRadius) // Căn giữa ảnh theo X
        .attr("y", imageY) // Gần cạnh trên
        .attr("width", imageSize)
        .attr("height", imageSize)
    // .attr("clip-path", `circle(${imageClipRadius}px at ${imageClipRadius}px ${imageClipRadius}px)`); // Giữ nguyên comment

    // 3. Văn bản Tên (Căn giữa theo X)
    const nameText = node.append("text")
        // DY sẽ được điều chỉnh cho dòng đầu tiên
        .attr("dy", baseNameDY + "em")
        .attr("x", 0) // Căn giữa
        .style("text-anchor", "middle") // Căn giữa
        .attr("class", "d3-name")
        .text(d => d.data.name);

    // 4. Văn bản Thế hệ (Tạm thời, căn giữa theo X)
    const genText = node.append("text")
        .attr("dy", "3em") // DY sẽ được cập nhật sau
        .attr("x", 0) // Căn giữa
        .style("text-anchor", "middle") // Căn giữa
        .attr("class", "d3-gen")
        .text(d => d.data.generationText);

    // 5. Áp dụng hàm xuống dòng và cập nhật vị trí thế hệ
    node.each(function (d, i) {
        // Áp dụng xuống dòng cho Tên
        const lines = wrapText(d3.select(this).select(".d3-name"), textWrapWidth);

        // Tính toán DY mới cho văn bản Thế hệ
        // Vị trí Thế hệ = DY khởi tạo của Tên + (Số dòng Tên - 1) * lineHeight + paddingNameGen
        const totalNameHeight = baseNameDY + (lines - 1) * lineHeight;
        const newGenDY = totalNameHeight + paddingNameGen;

        d3.select(this).select(".d3-gen")
            .attr("dy", newGenDY + "em");
    });


    // Vẽ các node vợ/chồng nằm ngoài cây (Đã khôi phục)
    const extraNodes = nodeDataArray.filter(m => !drawnNodeIds.has(m.id) && m.spid);
    extraNodes.forEach(member => {
        const spouseNode = nodePositionMap.get(member.spid);
        if (!spouseNode) return;

        // Tăng khoảng cách để node vợ/chồng nằm bên phải node chính
        const x = spouseNode.x + nodeBox.width + 10;
        const y = spouseNode.y;

        const gNode = g.append("g")
            .attr("class", `d3-node ${member.gender === "Nam" ? 'male' : 'female'}`)
            .attr("transform", `translate(${x},${y})`);

        // Hình chữ nhật
        gNode.append("rect")
            .attr("width", nodeBox.width).attr("height", nodeBox.height)
            .attr("x", -boxHalfWidth).attr("y", -boxHalfHeight).attr("rx", 5)
            .style("fill", "#fff").style("stroke", member.genderColor);

        // Ảnh đại diện cho vợ/chồng
        gNode.append("image")
            .attr("xlink:href", member.image || "../images/default.png")
            .attr("x", -imageClipRadius)
            .attr("y", imageY)
            .attr("width", imageSize)
            .attr("height", imageSize)
        // .attr("clip-path", `circle(${imageClipRadius}px at ${imageClipRadius}px ${imageClipRadius}px)`);


        // Văn bản Tên
        const spouseNameText = gNode.append("text").attr("dy", baseNameDY + "em")
            .attr("x", 0)
            .style("text-anchor", "middle")
            .attr("class", "d3-name").text(member.name);

        // Văn bản Thế hệ (Tạm thời)
        const spouseGenText = gNode.append("text").attr("dy", "3em")
            .attr("x", 0)
            .style("text-anchor", "middle")
            .attr("class", "d3-gen").text(member.generationText);

        // Áp dụng hàm xuống dòng và cập nhật vị trí thế hệ
        const lines = wrapText(spouseNameText, textWrapWidth);
        const totalNameHeight = baseNameDY + (lines - 1) * lineHeight;
        const newGenDY = totalNameHeight + paddingNameGen;

        spouseGenText.attr("dy", newGenDY + "em");

        // Cập nhật vị trí để vẽ đường nối vợ/chồng
        nodePositionMap.set(member.id, { x, y });
    });

    // Vẽ đường nối cha-con (Dùng rectOffset mới)
    g.selectAll(".link")
        .data(nodes.links())
        .enter().append("path")
        .attr("class", "d3-link")
        .attr("d", d => {
            const y_start = d.source.y + rectOffset; // Cạnh dưới node cha
            const y_end = d.target.y - rectOffset;
            const y_mid = (y_start + d.target.y) / 2;
            return `M${d.source.x},${y_start}V${y_mid}H${d.target.x} V${y_end} `;
        });



    // Vẽ đường nối vợ/chồng (Giữ nguyên logic với boxHalfWidth mới)
    const partnerLinks = [];
    nodeDataArray.forEach(member => {
        const { id, spid } = member;
        const node1 = nodePositionMap.get(id);
        const node2 = nodePositionMap.get(spid);
        if (spid && node1 && node2) {
            // Chỉ vẽ 1 lần cho cặp
            if (id < spid) {
                const linkY = node1.y;
                partnerLinks.push({
                    source: { x: node1.x + boxHalfWidth, y: linkY },
                    target: { x: node2.x - boxHalfWidth, y: linkY }
                });
            }
        }
    });

    g.selectAll(".partner-link")
        .data(partnerLinks)
        .enter().append("path")
        .attr("class", "d3-partner-link")
        .attr("d", d => `M${d.source.x},${d.source.y} L${d.target.x},${d.target.y}`);

    // Zoom/Pan
    const xMin = d3.min(nodes.descendants(), d => d.x);
    const xMax = d3.max(nodes.descendants(), d => d.x);
    const yMax = d3.max(nodes.descendants(), d => d.y);
    const horizontalShift = (chartWidth / 2) - (xMin + xMax) / 2;
    const actualHeight = yMax + margin.top + margin.bottom + 50;

    svg.attr("height", actualHeight);
    g.attr("transform", `translate(${margin.left + horizontalShift},${margin.top})`);

    const zoom = d3.zoom().scaleExtent([0.1, 4])
        .on('zoom', event => g.attr('transform', event.transform));
    svg.call(zoom);
    svg.call(zoom.transform, d3.zoomIdentity.translate(margin.left + horizontalShift, margin.top));
}

// Tải dữ liệu và vẽ cây
export function loadAndDrawPhado() {
    const chartContainer = document.getElementById("phado-chart-container");
    if (!chartContainer) {
        console.error("Không tìm thấy phần tử #phado-chart-container.");
        return;
    }

    chartContainer.textContent = "Đang tải phả đồ...";

    //  URL Ảnh mặc định 
    const defaultMaleImage = "../images/default-avatar.jpg";
    const defaultFemaleImage = "../images/default-avatar-female.jpg";

    fetch("../api/member.php")
        .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
        .then(data => {
            if (!Array.isArray(data) || data.length === 0) {
                chartContainer.textContent = "Chưa có dữ liệu thành viên.";
                return;
            }

            const nodeDataArray = data.map(m => {
                const generation = Number(m.generation) || 0;
                let name = m.name || m.Ten || "Không rõ tên";
                const gender = m.GioiTinh || m.gioitinh || "Nam";
                const pid = m.pid !== null ? Number(m.pid) : null;
                const spid = m.spouse_id ? Number(m.spouse_id) : null;

                // Logic chọn ảnh
                let memberImage = m.image_url;
                if (!memberImage || memberImage === "" || memberImage.toLowerCase() === "null") {
                    memberImage = (gender === "Nam") ? defaultMaleImage : defaultFemaleImage;
                }

                return {
                    id: Number(m.id),
                    pid,
                    spid,
                    name,
                    gender,
                    generation,
                    generationText: `Thế hệ ${generation || "?"}`,
                    image: memberImage,
                    genderColor: gender === "Nam" ? "#2196F3" : "#FF4081"
                };
            });

            // Tính tổng & thế hệ
            const totalMembers = nodeDataArray.length;
            const maxGeneration = Math.max(...nodeDataArray.map(m => m.generation || 0));

            // Cập nhật thống kê trong giao diện
            const memberCountEl = document.getElementById("member-count");
            const generationCountEl = document.getElementById("generation-count");
            if (memberCountEl && generationCountEl) {
                memberCountEl.textContent = totalMembers;
                generationCountEl.textContent = maxGeneration;
            }

            drawD3Phado(nodeDataArray, chartContainer);
        })
        .catch(err => {
            console.error("Lỗi tải dữ liệu:", err);
            chartContainer.textContent = `Lỗi: Không thể tải dữ liệu (${err})`;
        });


}

export function renderContent(pageKey, itemId = null) {
    const contentContainer = document.getElementById("spa-content");
    const content = (pageKey === "newsdetail" || pageKey === "gallerydetail") && itemId
        ? pages[pageKey](itemId)
        : pages[pageKey] || pages["trangchu"];

    window.history.pushState({ page: pageKey, id: itemId }, "", `#${pageKey}${itemId ? `/${itemId}` : ""}`);
    contentContainer.innerHTML = content;

    // Xử lý trang tương ứng
    if (["trangchu", "phaky", "congduc", "tintuc", "newsdetail"].includes(pageKey)) {
        setupNewsCardEvents();

        // gọi hàm sự kiến
    }
    if (pageKey === "sukien") {
        setupEventRegisterButton();
    }

    //  Gọi lại hàm vẽ phả đồ nếu đang ở trang "phido"
    if (pageKey === "phido") {
        loadAndDrawPhado();
    }

    let activeKey;
    if (pageKey === "newsdetail") activeKey = "tintuc";
    else if (pageKey === "gallerydetail") activeKey = "thuvien";
    else activeKey = pageKey || "trangchu";

    const navButtons = document.querySelectorAll(".nav-button");
    navButtons.forEach((btn) => btn.classList.remove("active"));
    const activeButton = document.querySelector(`.nav-button[data-page="${activeKey}"]`);
    if (activeButton) activeButton.classList.add("active");
}


// Điều hướng SPA (Back/Next)
export function setupNavigation() {
    const navButtons = document.querySelectorAll(".nav-button");

    navButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const pageKey = event.currentTarget.getAttribute("data-page");
            renderContent(pageKey);
        });
    });

    window.addEventListener("popstate", () => {
        const currentHash = window.location.hash.substring(1) || "trangchu";
        let pageKey, itemId = null;

        if (currentHash.includes("/")) {
            const parts = currentHash.split("/");
            pageKey = parts[0];
            itemId = parts[1];
        } else {
            pageKey = currentHash;
        }

        renderContent(pageKey, itemId);
    });
}

// Khởi tạo ứng dụng chính
export function initializeSPA() {
    setupNavigation();
    setupModal();

    const initialHash = window.location.hash.substring(1);
    let initialPage, initialId = null;

    if (initialHash.includes("/")) {
        const parts = initialHash.split("/");
        initialPage = parts[0];
        initialId = parts[1];
    } else {
        initialPage = initialHash || "trangchu";
    }

    renderContent(initialPage, initialId);
}