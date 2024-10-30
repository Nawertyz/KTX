// Lấy tham chiếu đến các phần tử HTML
const tenInput = document.getElementById("ten");
const msvInput = document.getElementById("msv");
const tienInput = document.getElementById("tien");
const addButton = document.querySelector("button[type='submit']");
const tableBody = document.querySelector("table tbody");

let currentRow = null; // Biến để lưu hàng hiện tại đang chỉnh sửa

// Hàm để định dạng số với dấu chấm
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Chuyển đổi số sang định dạng có dấu chấm
}

// Hàm thêm hóa đơn mới hoặc cập nhật hóa đơn đang chỉnh sửa
function addOrUpdateInvoice(event) {
    event.preventDefault(); // Ngăn chặn việc gửi form

    const ten = tenInput.value.trim();
    const msv = msvInput.value.trim();
    const tien = tienInput.value.trim();

    // Kiểm tra dữ liệu nhập vào
    if (ten === "" || msv === "" || tien === "") {
        alert("Vui lòng nhập đầy đủ thông tin!");
        return;
    }

    // Kiểm tra định dạng họ và tên (chỉ cho phép chữ cái)
    const nameRegex = /^[A-Za-zÀ-ỹ\s]+$/;
    if (!nameRegex.test(ten)) {
        alert("Họ và tên chỉ được nhập chữ cái!");
        return;
    }

    // Kiểm tra số tiền (phải lớn hơn 0)
    const tienValue = parseFloat(tien);
    if (isNaN(tienValue) || tienValue <= 0) {
        alert("Số tiền phải là số lớn hơn 0!");
        return;
    }

    // Nếu đang chỉnh sửa hàng, cập nhật dữ liệu
    if (currentRow) {
        currentRow.cells[0].textContent = ten;
        currentRow.cells[1].textContent = msv;
        currentRow.cells[2].textContent = formatNumber(tienValue) + " VND"; // Sử dụng hàm formatNumber
        alert("Đã cập nhật hóa đơn!");
        currentRow = null; // Đặt lại biến
    } else {
        // Kiểm tra xem mã sinh viên đã tồn tại chưa
        const existingRows = tableBody.getElementsByTagName("tr");
        for (let row of existingRows) {
            const existingMsv = row.cells[1].innerText.trim();
            if (existingMsv === msv) {
                alert("Mã sinh viên đã tồn tại!");
                return;
            }
        }

        // Tạo hàng mới cho hóa đơn
        const newRow = document.createElement("tr");
        newRow.innerHTML = `
            <td>${ten}</td>
            <td>${msv}</td>
            <td>${formatNumber(tienValue)} VND</td> <!-- Sử dụng hàm formatNumber -->
            <td>${new Date().toLocaleDateString()}</td>
            <td><button class="status-btn">Chưa thanh toán</button></td>
            <td>
                <button class="edit-btn">Chỉnh sửa</button>
                <button class="delete-btn">Xóa</button>
            </td>
        `;

        tableBody.appendChild(newRow);
    }

    // Xóa dữ liệu nhập sau khi thêm hoặc cập nhật
    tenInput.value = "";
    msvInput.value = "";
    tienInput.value = "";
}

// Chuyển đổi trạng thái thanh toán
function toggleStatus(button) {
    button.innerText = button.innerText === "Đã thanh toán" ? "Chưa thanh toán" : "Đã thanh toán";
    button.classList.toggle("paid"); // Thêm lớp để thay đổi giao diện nếu cần
}

// Xóa hàng hóa đơn
function deleteRow(button) {
    const row = button.closest("tr");
    const confirmDelete = confirm("Bạn có chắc chắn muốn xóa không?");
    if (confirmDelete) {
        tableBody.removeChild(row);
        alert("Đã xóa hóa đơn");
    }
}

// Chỉnh sửa hàng hóa đơn
function editRow(button) {
    currentRow = button.closest("tr");
    const cells = currentRow.querySelectorAll("td");

    tenInput.value = cells[0].textContent;
    msvInput.value = cells[1].textContent;
    const tienText = cells[2].textContent.replace(/ VND/, '').replace(/\./g, ''); // Lấy giá trị tiền
    tienInput.value = parseFloat(tienText.replace(/,/g, '')).toString(); // Lấy giá trị tiền
}

// Gán sự kiện cho nút Thêm
addButton.addEventListener("click", addOrUpdateInvoice);
tableBody.addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-btn")) {
        deleteRow(event.target);
    } else if (event.target.classList.contains("edit-btn")) {
        editRow(event.target);
    } else if (event.target.classList.contains("status-btn")) {
        toggleStatus(event.target);
    }
});
