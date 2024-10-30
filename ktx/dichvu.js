// Danh sách phòng ký túc xá hợp lệ
const danhSachPhongHopLe = ['101', '102', '103', '104', '105', '106', '107'];

document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("dichvu-form");
    const tableBody = document.querySelector("#dichvu-table tbody");
    const clearBtn = document.getElementById("clear-local-storage");

    let currentRow = null; // Biến để lưu hàng hiện tại đang chỉnh sửa

    // Hàm để thêm dữ liệu vào bảng
    function addData(phong, dien, nuoc) {
        const row = document.createElement("tr");
        const dienCost = dien * 3000; 
        const nuocCost = nuoc * 20000; 
        const dichvuCost = 100000;    

        row.innerHTML = `
            <td>${phong}</td>
            <td>${formatNumber(dienCost)}</td>
            <td>${formatNumber(nuocCost)}</td>
            <td>${formatNumber(dichvuCost)}</td>
            <td>${new Date().toLocaleDateString()}</td>
            <td><button class="status-btn">Chưa thanh toán</button></td> <!-- Nút chuyển trạng thái -->
            <td>
                <button class="edit-btn">Chỉnh sửa</button>
                <button class="delete-btn">Xóa</button>
            </td>
        `;

        tableBody.appendChild(row);
        alert("Đã thêm thành công");
    }

    // Hàm định dạng số
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Chuyển đổi số sang định dạng có dấu chấm
    }

    // Xử lý khi form được submit
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const phong = document.getElementById("phong").value;
        const dien = parseFloat(document.getElementById("dien").value);
        const nuoc = parseFloat(document.getElementById("nuoc").value);

        // Kiểm tra số phòng có trong danh sách hợp lệ
        if (!danhSachPhongHopLe.includes(phong)) {
            alert("Phòng không tồn tại!"); // Thông báo phòng không hợp lệ
            return; // Dừng lại nếu phòng không hợp lệ
        }

        // Kiểm tra số điện và số nước phải là số dương
        if (isNaN(dien) || dien < 0 || isNaN(nuoc) || nuoc < 0) {
            alert("Không hợp lệ!"); // Thông báo số điện hoặc nước không hợp lệ
            return; // Dừng lại nếu số điện hoặc nước không hợp lệ
        }

        if (currentRow) {
            // Nếu đang chỉnh sửa hàng, cập nhật dữ liệu
            const dienCost = dien * 3000;
            const nuocCost = nuoc * 20000;
            const dichvuCost = 100000;

            currentRow.cells[0].textContent = phong;
            currentRow.cells[1].textContent = formatNumber(dienCost);
            currentRow.cells[2].textContent = formatNumber(nuocCost);
            currentRow.cells[3].textContent = formatNumber(dichvuCost);
            alert("Đã cập nhật!");
            currentRow = null; // Đặt lại biến
        } else {
            // Nếu không có hàng nào đang chỉnh sửa, thêm mới
            addData(phong, dien, nuoc);
        }

        form.reset(); // Đặt lại form
    });

    // Chuyển đổi trạng thái thanh toán
    tableBody.addEventListener("click", function (event) {
        if (event.target.classList.contains("status-btn")) {
            const button = event.target;
            button.innerText = button.innerText === "Đã thanh toán" ? "Chưa thanh toán" : "Đã thanh toán";
            button.classList.toggle("paid"); // Thêm lớp để thay đổi giao diện nếu cần
        }
    });

    // Xóa hàng dữ liệu
    tableBody.addEventListener("click", function (event) {
        if (event.target.classList.contains("delete-btn")) {
            const confirmDelete = confirm("Bạn có chắc chắn muốn xóa không?");
            if (confirmDelete) {
                event.target.closest("tr").remove();
            }
        } else if (event.target.classList.contains("edit-btn")) {
            const row = event.target.closest("tr");
            const cells = row.querySelectorAll("td");

            // Lưu hàng hiện tại đang chỉnh sửa
            currentRow = row;

            // Lấy giá trị hiện tại để điền vào input
            const phong = cells[0].textContent;
            const dienCost = parseFloat(cells[1].textContent.replace(/\./g, '').replace(/,/g, '')); // Lấy giá trị điện gốc
            const nuocCost = parseFloat(cells[2].textContent.replace(/\./g, '').replace(/,/g, '')); // Lấy giá trị nước gốc

            // Điền dữ liệu vào ô input
            document.getElementById("phong").value = phong;
            document.getElementById("dien").value = dienCost / 3000; // Tính lại số điện từ giá trị tiền
            document.getElementById("nuoc").value = nuocCost / 20000; // Tính lại số nước từ giá trị tiền
        }
    });

    // Xóa toàn bộ dữ liệu
    clearBtn.addEventListener("click", function () {
        const confirmClear = confirm("Bạn có chắc chắn muốn xóa tất cả dữ liệu không?");
        if (confirmClear) {
            tableBody.innerHTML = "";
            alert("Tất cả dữ liệu đã bị xóa");
        }
    });
});
